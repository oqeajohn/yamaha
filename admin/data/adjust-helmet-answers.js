const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, 'yamaha.db');
const DATA_DIR = __dirname;

console.log('🔧 Adjusting helmet question answers to 100% correct...\n');

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

// Database helpers
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

// Database setup
const db = new sqlite3.Database(DB_PATH, async (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Connected to SQLite database\n');
    await adjustHelmetAnswers();
});

async function adjustHelmetAnswers() {
    try {
        // Get helmet question details
        const helmetQuestion = await allQuery(
            db,
            'SELECT id, question, correct_answer FROM questions WHERE id = 1'
        );
        
        if (!helmetQuestion.length) {
            console.error('❌ Helmet question not found');
            process.exit(1);
        }
        
        const question = helmetQuestion[0];
        console.log(`📝 Question: "${question.question}"`);
        console.log(`✅ Correct Answer: ${question.correct_answer}\n`);
        
        // Get current stats
        const beforeStats = await allQuery(
            db,
            `SELECT 
                COUNT(*) as total,
                SUM(is_correct) as correct,
                COUNT(*) - SUM(is_correct) as incorrect
             FROM answers 
             WHERE question_id = 1`
        );
        
        console.log('📊 Current Stats:');
        console.log(`   Total answers: ${beforeStats[0].total}`);
        console.log(`   Correct: ${beforeStats[0].correct}`);
        console.log(`   Incorrect: ${beforeStats[0].incorrect}\n`);
        
        if (beforeStats[0].incorrect === 0) {
            console.log('✅ All answers are already correct! No changes needed.\n');
            db.close();
            return;
        }
        
        // Update incorrect answers in database
        console.log('🔧 Updating database...');
        const dbResult = await runQuery(
            db,
            `UPDATE answers 
             SET selected_answer = ?, 
                 is_correct = 1 
             WHERE question_id = 1 
             AND is_correct = 0`,
            [question.correct_answer]
        );
        
        console.log(`   ✅ Updated ${dbResult.changes} answers in SQLite\n`);
        
        // Update answers.json
        console.log('💾 Updating answers.json...');
        const answersData = await readJSON('answers.json');
        
        let jsonUpdated = 0;
        answersData.answers.forEach(answer => {
            if (answer.question_id === 1 && answer.is_correct === 0) {
                answer.selected_answer = question.correct_answer;
                answer.is_correct = 1;
                jsonUpdated++;
            }
        });
        
        await writeJSON('answers.json', answersData);
        console.log(`   ✅ Updated ${jsonUpdated} answers in JSON\n`);
        
        // Verify final stats
        const afterStats = await allQuery(
            db,
            `SELECT 
                COUNT(*) as total,
                SUM(is_correct) as correct,
                ROUND(CAST(SUM(is_correct) AS FLOAT) / CAST(COUNT(*) AS FLOAT) * 100, 1) as accuracy
             FROM answers 
             WHERE question_id = 1`
        );
        
        console.log('📊 Final Stats:');
        console.log(`   Total answers: ${afterStats[0].total}`);
        console.log(`   Correct: ${afterStats[0].correct}`);
        console.log(`   Accuracy: ${afterStats[0].accuracy}%\n`);
        
        console.log('✅ Helmet question answers adjusted successfully!');
        console.log('🎯 All helmet question answers are now 100% correct!\n');
        
        db.close();
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        db.close();
        process.exit(1);
    }
}
