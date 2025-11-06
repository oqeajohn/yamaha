const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, 'yamaha.db');
const DATA_DIR = __dirname;

console.log('🔄 Syncing JSON data to SQLite database...\n');

// Read JSON file
async function readJSON(filename) {
    try {
        const filepath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filepath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`❌ Error reading ${filename}:`, error.message);
        return null;
    }
}

// Database helper
function runQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

function getQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function allQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Database setup
const db = new sqlite3.Database(DB_PATH, async (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Connected to SQLite database\n');
    await syncData();
});

async function syncData() {
    try {
        // Read JSON data
        console.log('📖 Reading JSON files...');
        const sessionsData = await readJSON('sessions.json');
        const answersData = await readJSON('answers.json');
        
        if (!sessionsData || !sessionsData.sessions) {
            console.error('❌ No sessions data found');
            process.exit(1);
        }
        
        console.log(`   Found ${sessionsData.sessions.length} sessions in JSON`);
        console.log(`   Found ${answersData?.answers?.length || 0} answers in JSON\n`);
        
        // Get current counts from database
        const dbSessionCount = await getQuery(db, 'SELECT COUNT(*) as count FROM sessions');
        const dbAnswerCount = await getQuery(db, 'SELECT COUNT(*) as count FROM answers');
        
        console.log('📊 Current database state:');
        console.log(`   ${dbSessionCount.count} sessions in database`);
        console.log(`   ${dbAnswerCount.count} answers in database\n`);
        
        // Sync Sessions
        console.log('🎮 Syncing sessions...');
        let sessionsInserted = 0;
        let sessionsUpdated = 0;
        let sessionsSkipped = 0;
        
        for (const session of sessionsData.sessions) {
            const existing = await getQuery(
                db,
                'SELECT id FROM sessions WHERE session_id = ?',
                [session.session_id]
            );
            
            if (existing) {
                // Update existing session
                await runQuery(
                    db,
                    `UPDATE sessions SET 
                        player_email = ?,
                        start_time = ?,
                        end_time = ?,
                        final_score = ?,
                        fuel_remaining = ?,
                        completed = ?,
                        ip_address = ?,
                        user_agent = ?
                    WHERE session_id = ?`,
                    [
                        session.player_email || null,
                        session.start_time,
                        session.end_time || null,
                        session.final_score || 0,
                        session.fuel_remaining || 0,
                        session.completed || 0,
                        session.ip_address || null,
                        session.user_agent || null,
                        session.session_id
                    ]
                );
                sessionsUpdated++;
            } else {
                // Insert new session
                try {
                    await runQuery(
                        db,
                        `INSERT INTO sessions (session_id, player_email, start_time, end_time, final_score, fuel_remaining, completed, ip_address, user_agent)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            session.session_id,
                            session.player_email || null,
                            session.start_time,
                            session.end_time || null,
                            session.final_score || 0,
                            session.fuel_remaining || 0,
                            session.completed || 0,
                            session.ip_address || null,
                            session.user_agent || null
                        ]
                    );
                    sessionsInserted++;
                } catch (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        sessionsSkipped++;
                    } else {
                        throw err;
                    }
                }
            }
        }
        
        console.log(`   ✅ ${sessionsInserted} sessions inserted`);
        console.log(`   🔄 ${sessionsUpdated} sessions updated`);
        if (sessionsSkipped > 0) {
            console.log(`   ⏭️  ${sessionsSkipped} sessions skipped (duplicates)`);
        }
        console.log('');
        
        // Sync Answers
        if (answersData && answersData.answers) {
            console.log('📊 Syncing answers...');
            let answersInserted = 0;
            let answersSkipped = 0;
            
            for (const answer of answersData.answers) {
                try {
                    // Check if this exact answer already exists
                    const existing = await getQuery(
                        db,
                        'SELECT id FROM answers WHERE session_id = ? AND question_id = ? AND answered_at = ?',
                        [answer.session_id, answer.question_id, answer.answered_at]
                    );
                    
                    if (!existing) {
                        await runQuery(
                            db,
                            `INSERT INTO answers (session_id, player_email, question_id, selected_answer, is_correct, answered_at)
                            VALUES (?, ?, ?, ?, ?, ?)`,
                            [
                                answer.session_id,
                                answer.player_email || null,
                                answer.question_id,
                                answer.selected_answer,
                                answer.is_correct || 0,
                                answer.answered_at || new Date().toISOString()
                            ]
                        );
                        answersInserted++;
                    } else {
                        answersSkipped++;
                    }
                } catch (err) {
                    if (err.message.includes('FOREIGN KEY constraint failed')) {
                        console.log(`   ⚠️  Skipping answer for missing session: ${answer.session_id.substring(0, 16)}...`);
                    } else {
                        console.error(`   ❌ Error inserting answer: ${err.message}`);
                    }
                }
            }
            
            console.log(`   ✅ ${answersInserted} answers inserted`);
            if (answersSkipped > 0) {
                console.log(`   ⏭️  ${answersSkipped} answers skipped (already exist)`);
            }
            console.log('');
        }
        
        // Find sessions with missing answers
        console.log('🔍 Analyzing data integrity...\n');
        
        const sessionsWithoutAnswers = await allQuery(
            db,
            `SELECT s.session_id, s.player_email, s.start_time, s.final_score, s.completed
            FROM sessions s
            LEFT JOIN answers a ON s.session_id = a.session_id
            WHERE a.id IS NULL
            ORDER BY s.start_time DESC`
        );
        
        console.log('📋 Sessions without any answers:');
        if (sessionsWithoutAnswers.length === 0) {
            console.log('   ✅ All sessions have associated answers!\n');
        } else {
            console.log(`   ⚠️  Found ${sessionsWithoutAnswers.length} sessions without answers:\n`);
            
            // Group by completion status
            const incomplete = sessionsWithoutAnswers.filter(s => s.completed === 0);
            const completed = sessionsWithoutAnswers.filter(s => s.completed === 1);
            
            if (incomplete.length > 0) {
                console.log(`   📌 Incomplete sessions (${incomplete.length}) - likely started but not played:`);
                incomplete.slice(0, 5).forEach(s => {
                    console.log(`      • ${s.session_id.substring(0, 16)}... | ${s.player_email || 'anonymous'} | ${s.start_time}`);
                });
                if (incomplete.length > 5) {
                    console.log(`      ... and ${incomplete.length - 5} more`);
                }
                console.log('');
            }
            
            if (completed.length > 0) {
                console.log(`   ⚠️  COMPLETED sessions (${completed.length}) - these should have answers!`);
                completed.forEach(s => {
                    console.log(`      • ${s.session_id.substring(0, 16)}... | ${s.player_email || 'anonymous'} | Score: ${s.final_score}`);
                });
                console.log('');
                console.log(`   💡 These ${completed.length} completed sessions are missing answers due to data corruption.`);
                console.log('      Unfortunately, we cannot recover the specific answers without the original data.\n');
            }
        }
        
        // Final counts
        const finalSessionCount = await getQuery(db, 'SELECT COUNT(*) as count FROM sessions');
        const finalAnswerCount = await getQuery(db, 'SELECT COUNT(*) as count FROM answers');
        
        console.log('📊 Final database state:');
        console.log(`   ${finalSessionCount.count} total sessions`);
        console.log(`   ${finalAnswerCount.count} total answers`);
        
        // Calculate answer coverage
        const sessionsWithAnswers = await getQuery(
            db,
            `SELECT COUNT(DISTINCT session_id) as count FROM answers`
        );
        
        const coverage = ((sessionsWithAnswers.count / finalSessionCount.count) * 100).toFixed(1);
        console.log(`   ${sessionsWithAnswers.count} sessions have answers (${coverage}% coverage)`);
        
        console.log('\n✅ Sync completed successfully!');
        
        db.close();
    } catch (error) {
        console.error('\n❌ Error during sync:', error.message);
        console.error(error.stack);
        db.close();
        process.exit(1);
    }
}
