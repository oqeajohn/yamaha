const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'yamaha.db');

console.log('Starting migration to SQLite...\n');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('✓ Connected to SQLite database');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables
const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Questions table
      db.run(`
        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY,
          section TEXT NOT NULL,
          question TEXT NOT NULL,
          explanation TEXT,
          option_a TEXT NOT NULL,
          option_b TEXT NOT NULL,
          correct_answer INTEGER NOT NULL CHECK(correct_answer IN (0, 1)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          active INTEGER DEFAULT 1 CHECK(active IN (0, 1))
        )
      `, (err) => {
        if (err) reject(err);
        else console.log('✓ Created questions table');
      });

      // Sessions table
      db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT UNIQUE NOT NULL,
          player_email TEXT NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT,
          final_score INTEGER DEFAULT 0,
          fuel_remaining INTEGER DEFAULT 0,
          completed INTEGER DEFAULT 0 CHECK(completed IN (0, 1)),
          ip_address TEXT,
          user_agent TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        )
      `, (err) => {
        if (err) reject(err);
        else console.log('✓ Created sessions table');
      });

      // Create index on session_id for faster lookups
      db.run(`
        CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions(session_id)
      `);

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_sessions_player_email ON sessions(player_email)
      `);

      // Answers table (without foreign key constraints for migration)
      db.run(`
        CREATE TABLE IF NOT EXISTS answers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT NOT NULL,
          player_email TEXT NOT NULL,
          question_id INTEGER NOT NULL,
          selected_answer INTEGER NOT NULL CHECK(selected_answer IN (0, 1)),
          is_correct INTEGER NOT NULL CHECK(is_correct IN (0, 1)),
          answered_at TEXT NOT NULL
        )
      `, (err) => {
        if (err) reject(err);
        else console.log('✓ Created answers table');
      });

      // Create indexes on answers
      db.run(`
        CREATE INDEX IF NOT EXISTS idx_answers_session_id ON answers(session_id)
      `);

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_answers_player_email ON answers(player_email)
      `);

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id)
      `, () => {
        resolve();
      });
    });
  });
};

// Migrate questions
const migrateQuestions = () => {
  return new Promise((resolve, reject) => {
    console.log('\nMigrating questions...');
    const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'qs.json'), 'utf8')).questions;
    
    const stmt = db.prepare(`
      INSERT INTO questions (id, section, question, explanation, option_a, option_b, correct_answer, created_at, updated_at, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let count = 0;
    questions.forEach((q) => {
      stmt.run(
        q.id,
        q.section,
        q.question,
        q.explanation,
        q.option_a,
        q.option_b,
        q.correct_answer,
        q.created_at,
        q.updated_at,
        q.active
      );
      count++;
    });

    stmt.finalize((err) => {
      if (err) reject(err);
      else {
        console.log(`✓ Migrated ${count} questions`);
        resolve();
      }
    });
  });
};

// Migrate sessions
const migrateSessions = () => {
  return new Promise((resolve, reject) => {
    console.log('\nMigrating sessions...');
    const sessions = JSON.parse(fs.readFileSync(path.join(__dirname, 'sessions.json'), 'utf8')).sessions;
    
    const stmt = db.prepare(`
      INSERT INTO sessions (session_id, player_email, start_time, end_time, final_score, fuel_remaining, completed, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let count = 0;
    sessions.forEach((s) => {
      stmt.run(
        s.session_id,
        s.player_email,
        s.start_time,
        s.end_time,
        s.final_score,
        s.fuel_remaining,
        s.completed,
        s.ip_address,
        s.user_agent
      );
      count++;
    });

    stmt.finalize((err) => {
      if (err) reject(err);
      else {
        console.log(`✓ Migrated ${count} sessions`);
        resolve();
      }
    });
  });
};

// Migrate answers
const migrateAnswers = () => {
  return new Promise((resolve, reject) => {
    console.log('\nMigrating answers...');
    const answers = JSON.parse(fs.readFileSync(path.join(__dirname, 'answers.json'), 'utf8')).answers;
    
    const stmt = db.prepare(`
      INSERT INTO answers (session_id, player_email, question_id, selected_answer, is_correct, answered_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    let count = 0;
    const batchSize = 1000;
    
    db.run('BEGIN TRANSACTION');
    
    answers.forEach((a, index) => {
      stmt.run(
        a.session_id,
        a.player_email,
        a.question_id,
        a.selected_answer,
        a.is_correct,
        a.answered_at
      );
      count++;
      
      // Commit in batches for better performance
      if (count % batchSize === 0) {
        console.log(`  Processed ${count} answers...`);
      }
    });

    stmt.finalize((err) => {
      if (err) {
        db.run('ROLLBACK');
        reject(err);
      } else {
        db.run('COMMIT', (err) => {
          if (err) reject(err);
          else {
            console.log(`✓ Migrated ${count} answers`);
            resolve();
          }
        });
      }
    });
  });
};

// Verify migration
const verifyMigration = () => {
  return new Promise((resolve, reject) => {
    console.log('\nVerifying migration...');
    
    db.get('SELECT COUNT(*) as count FROM questions', (err, row) => {
      if (err) return reject(err);
      console.log(`✓ Questions in DB: ${row.count}`);
    });
    
    db.get('SELECT COUNT(*) as count FROM sessions', (err, row) => {
      if (err) return reject(err);
      console.log(`✓ Sessions in DB: ${row.count}`);
    });
    
    db.get('SELECT COUNT(*) as count FROM answers', (err, row) => {
      if (err) return reject(err);
      console.log(`✓ Answers in DB: ${row.count}`);
      resolve();
    });
  });
};

// Run migration
(async () => {
  try {
    await createTables();
    await migrateQuestions();
    await migrateSessions();
    await migrateAnswers();
    await verifyMigration();
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✓ Migration completed successfully!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`\nDatabase created at: ${DB_PATH}`);
    console.log('\nNext steps:');
    console.log('1. Update server.js to use SQLite instead of JSON files');
    console.log('2. Create backup of JSON files');
    console.log('3. Test the new database thoroughly');
    
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  } finally {
    db.close();
  }
})();
