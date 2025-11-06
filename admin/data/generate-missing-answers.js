const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, 'yamaha.db');
const DATA_DIR = __dirname;

console.log('🔄 Generating missing answer records...\n');

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

// Write JSON file
async function writeJSON(filename, data) {
    try {
        const filepath = path.join(DATA_DIR, filename);
        await fs.writeFile(filepath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`❌ Error writing ${filename}:`, error.message);
        throw error;
    }
}

// Database helper
function allQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function runQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

// Shuffle array
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Generate random answers for a session
function generateAnswers(session, questions, numCorrect, numIncorrect) {
    const answers = [];
    const shuffledQuestions = shuffle(questions);
    const totalAnswers = numCorrect + numIncorrect;
    
    if (totalAnswers > questions.length) {
        console.warn(`   ⚠️  Warning: Requested ${totalAnswers} answers but only ${questions.length} questions available`);
    }
    
    const questionsToUse = shuffledQuestions.slice(0, totalAnswers);
    
    // Generate correct answers
    for (let i = 0; i < numCorrect && i < questionsToUse.length; i++) {
        const question = questionsToUse[i];
        const answerTime = new Date(new Date(session.start_time).getTime() + (i * 30000)); // 30 seconds apart
        
        answers.push({
            session_id: session.session_id,
            player_email: session.player_email || null,
            question_id: question.id,
            selected_answer: question.correct_answer,
            is_correct: 1,
            answered_at: answerTime.toISOString()
        });
    }
    
    // Generate incorrect answers
    for (let i = numCorrect; i < totalAnswers && i < questionsToUse.length; i++) {
        const question = questionsToUse[i];
        const wrongAnswer = question.correct_answer === 0 ? 1 : 0;
        const answerTime = new Date(new Date(session.start_time).getTime() + (i * 30000));
        
        answers.push({
            session_id: session.session_id,
            player_email: session.player_email || null,
            question_id: question.id,
            selected_answer: wrongAnswer,
            is_correct: 0,
            answered_at: answerTime.toISOString()
        });
    }
    
    return answers;
}

// Database setup
const db = new sqlite3.Database(DB_PATH, async (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Connected to SQLite database\n');
    await generateMissingAnswers();
});

async function generateMissingAnswers() {
    try {
        // Read questions
        const questionsData = await readJSON('qs.json');
        const activeQuestions = questionsData.questions.filter(q => q.active === 1);
        console.log(`📚 Loaded ${activeQuestions.length} active questions\n`);
        
        // Read current answers
        const answersData = await readJSON('answers.json');
        let maxAnswerId = Math.max(...answersData.answers.map(a => a.id), 0);
        
        console.log(`📊 Current answers.json has ${answersData.answers.length} records\n`);
        
        // Get sessions without answers from database
        const sessionsWithoutAnswers = await allQuery(
            db,
            `SELECT s.session_id, s.player_email, s.start_time, s.final_score, s.completed
             FROM sessions s
             LEFT JOIN answers a ON s.session_id = a.session_id
             WHERE a.id IS NULL
             ORDER BY s.start_time`
        );
        
        console.log(`🔍 Found ${sessionsWithoutAnswers.length} sessions without answers\n`);
        
        let generatedCount = 0;
        let skippedCount = 0;
        let completedSessionsCount = 0;
        let incompleteWithScoreCount = 0;
        const newAnswers = [];
        
        console.log('🎲 Generating answers...\n');
        
        for (const session of sessionsWithoutAnswers) {
            const score = session.final_score || 0;
            const completed = session.completed;
            
            // Skip if incomplete with no score
            if (completed === 0 && score === 0) {
                skippedCount++;
                continue;
            }
            
            // Calculate number of correct answers based on score
            // Each correct answer = 500 points
            const numCorrect = Math.round(score / 500);
            
            if (numCorrect === 0) {
                skippedCount++;
                continue;
            }
            
            // For completed sessions, generate some incorrect answers too (realistic gameplay)
            let numIncorrect = 0;
            if (completed === 1) {
                completedSessionsCount++;
                // Generate 1-3 incorrect answers to make it realistic
                numIncorrect = Math.floor(Math.random() * 3) + 1;
            } else {
                incompleteWithScoreCount++;
                // Incomplete sessions might have fewer incorrect answers
                numIncorrect = Math.floor(Math.random() * 2);
            }
            
            // Generate answers
            const sessionAnswers = generateAnswers(session, activeQuestions, numCorrect, numIncorrect);
            
            // Add to answers array with proper IDs
            for (const answer of sessionAnswers) {
                maxAnswerId++;
                newAnswers.push({
                    id: maxAnswerId,
                    ...answer
                });
                generatedCount++;
            }
            
            if ((completedSessionsCount + incompleteWithScoreCount) % 50 === 0) {
                console.log(`   Processed ${completedSessionsCount + incompleteWithScoreCount} sessions...`);
            }
        }
        
        console.log('\n📈 Generation Summary:');
        console.log(`   ✅ Generated ${generatedCount} answer records`);
        console.log(`   📝 For ${completedSessionsCount} completed sessions`);
        console.log(`   📝 For ${incompleteWithScoreCount} incomplete sessions with scores`);
        console.log(`   ⏭️  Skipped ${skippedCount} sessions (no score)\n`);
        
        // Add new answers to existing answers
        answersData.answers.push(...newAnswers);
        
        // Sort by ID
        answersData.answers.sort((a, b) => a.id - b.id);
        
        console.log('💾 Saving to answers.json...');
        await writeJSON('answers.json', answersData);
        
        console.log(`✅ Updated answers.json: ${answersData.answers.length} total records\n`);
        
        // Now insert into database
        console.log('💾 Inserting into SQLite database...');
        
        let insertedCount = 0;
        for (const answer of newAnswers) {
            try {
                await runQuery(
                    db,
                    `INSERT INTO answers (session_id, player_email, question_id, selected_answer, is_correct, answered_at)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        answer.session_id,
                        answer.player_email,
                        answer.question_id,
                        answer.selected_answer,
                        answer.is_correct,
                        answer.answered_at
                    ]
                );
                insertedCount++;
                
                if (insertedCount % 100 === 0) {
                    console.log(`   Inserted ${insertedCount} records...`);
                }
            } catch (err) {
                console.error(`   ⚠️  Error inserting answer: ${err.message}`);
            }
        }
        
        console.log(`\n✅ Inserted ${insertedCount} records into database\n`);
        
        // Final verification
        const finalSessionCount = await allQuery(
            db,
            `SELECT COUNT(*) as count FROM sessions`
        );
        
        const finalAnswerCount = await allQuery(
            db,
            `SELECT COUNT(*) as count FROM answers`
        );
        
        const sessionsWithAnswersCount = await allQuery(
            db,
            `SELECT COUNT(DISTINCT session_id) as count FROM answers`
        );
        
        const coverage = ((sessionsWithAnswersCount[0].count / finalSessionCount[0].count) * 100).toFixed(1);
        
        console.log('📊 Final Database State:');
        console.log(`   ${finalSessionCount[0].count} total sessions`);
        console.log(`   ${finalAnswerCount[0].count} total answers`);
        console.log(`   ${sessionsWithAnswersCount[0].count} sessions have answers (${coverage}% coverage)`);
        
        console.log('\n✅ Answer generation completed successfully!');
        
        db.close();
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        db.close();
        process.exit(1);
    }
}
