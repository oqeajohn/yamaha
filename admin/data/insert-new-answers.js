const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, 'yamaha.db');
const DATA_DIR = __dirname;

console.log('📥 Inserting new answer records...\n');

const newAnswers = [
  {
    session_id: "d81ea404d64098623ecfed5645f985162c5d1cc2e3b4ad7f12df8ff1faf444f9",
    player_email: "desbm_vergara@yahoo.com",
    question_id: 29,
    selected_answer: 0,
    is_correct: 1,
    answered_at: "2025-11-06T08:59:15.696Z"
  },
  {
    session_id: "4920fa9f687d372a2662d85fc4ab4c2b44dc0d43edc0888019c7bb2af48d900a",
    player_email: "justincambe1524@gmail.com",
    question_id: 25,
    selected_answer: 1,
    is_correct: 1,
    answered_at: "2025-11-06T08:59:19.615Z"
  },
  {
    session_id: "d81ea404d64098623ecfed5645f985162c5d1cc2e3b4ad7f12df8ff1faf444f9",
    player_email: "desbm_vergara@yahoo.com",
    question_id: 24,
    selected_answer: 0,
    is_correct: 1,
    answered_at: "2025-11-06T09:00:01.177Z"
  },
  {
    session_id: "d81ea404d64098623ecfed5645f985162c5d1cc2e3b4ad7f12df8ff1faf444f9",
    player_email: "desbm_vergara@yahoo.com",
    question_id: 31,
    selected_answer: 0,
    is_correct: 1,
    answered_at: "2025-11-06T09:00:45.808Z"
  },
  {
    session_id: "545dea993767df4b4169363d3812786c135fbbf35131b72f313a8f3c33bf2a97",
    player_email: "justincambe1524@gmail.com",
    question_id: 35,
    selected_answer: 0,
    is_correct: 1,
    answered_at: "2025-11-06T09:01:01.099Z"
  },
  {
    session_id: "d81ea404d64098623ecfed5645f985162c5d1cc2e3b4ad7f12df8ff1faf444f9",
    player_email: "desbm_vergara@yahoo.com",
    question_id: 1,
    selected_answer: 0,
    is_correct: 1,
    answered_at: "2025-11-06T09:01:25.123Z"
  },
  {
    session_id: "545dea993767df4b4169363d3812786c135fbbf35131b72f313a8f3c33bf2a97",
    player_email: "justincambe1524@gmail.com",
    question_id: 22,
    selected_answer: 0,
    is_correct: 1,
    answered_at: "2025-11-06T09:01:36.197Z"
  },
  {
    session_id: "d81ea404d64098623ecfed5645f985162c5d1cc2e3b4ad7f12df8ff1faf444f9",
    player_email: "desbm_vergara@yahoo.com",
    question_id: 20,
    selected_answer: 0,
    is_correct: 1,
    answered_at: "2025-11-06T09:01:52.070Z"
  },
  {
    session_id: "545dea993767df4b4169363d3812786c135fbbf35131b72f313a8f3c33bf2a97",
    player_email: "justincambe1524@gmail.com",
    question_id: 29,
    selected_answer: 0,
    is_correct: 1,
    answered_at: "2025-11-06T09:02:09.819Z"
  },
  {
    session_id: "545dea993767df4b4169363d3812786c135fbbf35131b72f313a8f3c33bf2a97",
    player_email: "justincambe1524@gmail.com",
    question_id: 20,
    selected_answer: 0,
    is_correct: 1,
    answered_at: "2025-11-06T09:02:41.720Z"
  },
  {
    session_id: "545dea993767df4b4169363d3812786c135fbbf35131b72f313a8f3c33bf2a97",
    player_email: "justincambe1524@gmail.com",
    question_id: 25,
    selected_answer: 1,
    is_correct: 1,
    answered_at: "2025-11-06T09:03:12.597Z"
  },
  {
    session_id: "21de1a724f70a86a7bcfda7e9fc13b6e85ec63525f3567bef4b1bb310d7ef39a",
    player_email: "paulkentbenedictc@gmail.com",
    question_id: 20,
    selected_answer: 0,
    is_correct: 1,
    answered_at: "2025-11-06T09:16:10.305Z"
  },
  {
    session_id: "21de1a724f70a86a7bcfda7e9fc13b6e85ec63525f3567bef4b1bb310d7ef39a",
    player_email: "paulkentbenedictc@gmail.com",
    question_id: 25,
    selected_answer: 1,
    is_correct: 1,
    answered_at: "2025-11-06T09:16:44.720Z"
  },
  {
    session_id: "21de1a724f70a86a7bcfda7e9fc13b6e85ec63525f3567bef4b1bb310d7ef39a",
    player_email: "paulkentbenedictc@gmail.com",
    question_id: 2,
    selected_answer: 1,
    is_correct: 1,
    answered_at: "2025-11-06T09:17:14.050Z"
  },
  {
    session_id: "21de1a724f70a86a7bcfda7e9fc13b6e85ec63525f3567bef4b1bb310d7ef39a",
    player_email: "paulkentbenedictc@gmail.com",
    question_id: 30,
    selected_answer: 1,
    is_correct: 1,
    answered_at: "2025-11-06T09:17:45.875Z"
  }
];

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

const db = new sqlite3.Database(DB_PATH, async (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Connected to SQLite database\n');
    await insertAnswers();
});

async function insertAnswers() {
    try {
        // Get current max ID from database
        const maxIdResult = await getQuery(db, 'SELECT MAX(id) as maxId FROM answers');
        let currentMaxId = maxIdResult.maxId || 0;
        
        console.log(`📊 Current max answer ID: ${currentMaxId}\n`);
        
        // Read answers.json
        const answersData = await readJSON('answers.json');
        const jsonMaxId = Math.max(...answersData.answers.map(a => a.id), 0);
        
        console.log(`📊 Current max ID in JSON: ${jsonMaxId}\n`);
        
        // Use the higher of the two
        let nextId = Math.max(currentMaxId, jsonMaxId) + 1;
        
        console.log('💾 Inserting into SQLite database...\n');
        
        let insertedCount = 0;
        const answersWithIds = [];
        
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
                
                answersWithIds.push({
                    id: nextId,
                    ...answer
                });
                
                console.log(`   ✅ Inserted answer ${nextId} for ${answer.player_email}`);
                nextId++;
                insertedCount++;
            } catch (err) {
                console.error(`   ❌ Error inserting answer: ${err.message}`);
            }
        }
        
        console.log(`\n✅ Inserted ${insertedCount} answers into database\n`);
        
        // Update answers.json
        console.log('💾 Updating answers.json...\n');
        
        answersData.answers.push(...answersWithIds);
        answersData.answers.sort((a, b) => a.id - b.id);
        
        await writeJSON('answers.json', answersData);
        
        console.log(`✅ Updated answers.json with ${answersWithIds.length} new records\n`);
        
        // Verify
        const finalCount = await getQuery(db, 'SELECT COUNT(*) as count FROM answers');
        console.log(`📊 Total answers in database: ${finalCount.count}\n`);
        
        // Check sessions coverage
        const sessionsWithAnswers = await getQuery(
            db,
            `SELECT COUNT(DISTINCT session_id) as count FROM answers`
        );
        
        const totalSessions = await getQuery(db, 'SELECT COUNT(*) as count FROM sessions');
        
        const coverage = ((sessionsWithAnswers.count / totalSessions.count) * 100).toFixed(1);
        
        console.log(`📊 Sessions with answers: ${sessionsWithAnswers.count}/${totalSessions.count} (${coverage}%)\n`);
        
        console.log('✅ All answers inserted successfully!\n');
        
        db.close();
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        db.close();
        process.exit(1);
    }
}
