const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, 'yamaha.db');
const DATA_DIR = __dirname;

console.log('🔄 Starting migration from JSON to SQLite...\n');

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

// Database setup
const db = new sqlite3.Database(DB_PATH, async (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Connected to SQLite database\n');
    await migrate();
});

async function migrate() {
    // Read JSON data
    console.log('📖 Reading JSON files...');
    const questionsData = await readJSON('qs.json');
    const sessionsData = await readJSON('sessions.json');
    const answersData = await readJSON('answers.json');
    const playersData = await readJSON('players.json');
    const kamoteData = await readJSON('kamote_messages.json');
    
    db.serialize(() => {
        // Migrate Questions
        if (questionsData && questionsData.questions) {
            console.log(`\n📝 Migrating ${questionsData.questions.length} questions...`);
            const stmt = db.prepare(`
                INSERT OR IGNORE INTO questions 
                (id, section, question, option_a, option_b, correct_answer, explanation, created_at, updated_at, active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            questionsData.questions.forEach(q => {
                stmt.run(
                    q.id,
                    q.section,
                    q.question,
                    q.option_a,
                    q.option_b,
                    q.correct_answer,
                    q.explanation || '',
                    q.created_at || new Date().toISOString(),
                    q.updated_at || new Date().toISOString(),
                    q.active !== undefined ? q.active : 1
                );
            });
            
            stmt.finalize((err) => {
                if (err) console.error('❌ Error migrating questions:', err.message);
                else console.log('✅ Questions migrated successfully');
            });
        }
        
        // Migrate Kamote Messages
        if (kamoteData && kamoteData.messages) {
            console.log(`\n💬 Migrating ${kamoteData.messages.length} kamote messages...`);
            const stmt = db.prepare(`
                INSERT OR IGNORE INTO kamote_messages 
                (id, message, active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
            `);
            
            kamoteData.messages.forEach(m => {
                stmt.run(
                    m.id,
                    m.message,
                    m.active !== undefined ? m.active : 1,
                    m.created_at || new Date().toISOString(),
                    m.updated_at || new Date().toISOString()
                );
            });
            
            stmt.finalize((err) => {
                if (err) console.error('❌ Error migrating kamote messages:', err.message);
                else console.log('✅ Kamote messages migrated successfully');
            });
        }
        
        // Migrate Players
        if (playersData && playersData.players) {
            console.log(`\n👥 Migrating ${playersData.players.length} players...`);
            const stmt = db.prepare(`
                INSERT OR IGNORE INTO players 
                (email, registered_at, has_redirected, redirected_at)
                VALUES (?, ?, ?, ?)
            `);
            
            playersData.players.forEach(p => {
                stmt.run(
                    p.email,
                    p.registered_at || new Date().toISOString(),
                    p.has_redirected ? 1 : 0,
                    p.redirected_at || null
                );
            });
            
            stmt.finalize((err) => {
                if (err) console.error('❌ Error migrating players:', err.message);
                else console.log('✅ Players migrated successfully');
            });
        }
        
        // Migrate Sessions
        if (sessionsData && sessionsData.sessions) {
            console.log(`\n🎮 Migrating ${sessionsData.sessions.length} sessions...`);
            const stmt = db.prepare(`
                INSERT OR IGNORE INTO sessions 
                (id, session_id, player_email, start_time, end_time, final_score, fuel_remaining, completed, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            sessionsData.sessions.forEach(s => {
                stmt.run(
                    s.id,
                    s.session_id,
                    s.player_email || null,
                    s.start_time,
                    s.end_time || null,
                    s.final_score || 0,
                    s.fuel_remaining || 0,
                    s.completed || 0,
                    s.ip_address || null,
                    s.user_agent || null
                );
            });
            
            stmt.finalize((err) => {
                if (err) console.error('❌ Error migrating sessions:', err.message);
                else console.log('✅ Sessions migrated successfully');
            });
        }
        
        // Migrate Answers
        if (answersData && answersData.answers) {
            console.log(`\n📊 Migrating ${answersData.answers.length} answers...`);
            const stmt = db.prepare(`
                INSERT OR IGNORE INTO answers 
                (id, session_id, player_email, question_id, selected_answer, is_correct, answered_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            
            answersData.answers.forEach(a => {
                stmt.run(
                    a.id,
                    a.session_id,
                    a.player_email || null,
                    a.question_id,
                    a.selected_answer,
                    a.is_correct || 0,
                    a.answered_at || new Date().toISOString()
                );
            });
            
            stmt.finalize((err) => {
                if (err) console.error('❌ Error migrating answers:', err.message);
                else console.log('✅ Answers migrated successfully');
                
                // Close database after all migrations
                db.close((err) => {
                    if (err) {
                        console.error('❌ Error closing database:', err.message);
                    } else {
                        console.log('\n✅ Database migration completed successfully!');
                        console.log(`📁 SQLite database: ${DB_PATH}`);
                    }
                });
            });
        } else {
            db.close();
        }
    });
}
