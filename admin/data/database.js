const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'yamaha.db');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) reject(err);
        else {
          this.db.run('PRAGMA foreign_keys = ON');
          resolve();
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // Questions
  getAllQuestions() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM questions WHERE active = 1 ORDER BY id', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getQuestionById(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM questions WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  createQuestion(question) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      this.db.run(`
        INSERT INTO questions (section, question, explanation, option_a, option_b, correct_answer, created_at, updated_at, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        question.section,
        question.question,
        question.explanation,
        question.option_a,
        question.option_b,
        question.correct_answer,
        now,
        now,
        1
      ], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  }

  updateQuestion(id, question) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      this.db.run(`
        UPDATE questions 
        SET section = ?, question = ?, explanation = ?, option_a = ?, option_b = ?, correct_answer = ?, updated_at = ?
        WHERE id = ?
      `, [
        question.section,
        question.question,
        question.explanation,
        question.option_a,
        question.option_b,
        question.correct_answer,
        now,
        id
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  deleteQuestion(id) {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE questions SET active = 0 WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Sessions
  getAllSessions() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM sessions ORDER BY start_time DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getSessionById(sessionId) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM sessions WHERE session_id = ?', [sessionId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  getSessionsByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM sessions WHERE player_email = ? ORDER BY start_time DESC', [email], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  createSession(session) {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO sessions (session_id, player_email, start_time, end_time, final_score, fuel_remaining, completed, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        session.session_id,
        session.player_email,
        session.start_time,
        session.end_time || null,
        session.final_score || 0,
        session.fuel_remaining || 0,
        session.completed || 0,
        session.ip_address,
        session.user_agent
      ], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, session_id: session.session_id });
      });
    });
  }

  updateSession(sessionId, updates) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];
      
      if (updates.end_time !== undefined) {
        fields.push('end_time = ?');
        values.push(updates.end_time);
      }
      if (updates.final_score !== undefined) {
        fields.push('final_score = ?');
        values.push(updates.final_score);
      }
      if (updates.fuel_remaining !== undefined) {
        fields.push('fuel_remaining = ?');
        values.push(updates.fuel_remaining);
      }
      if (updates.completed !== undefined) {
        fields.push('completed = ?');
        values.push(updates.completed);
      }
      
      values.push(sessionId);
      
      this.db.run(`UPDATE sessions SET ${fields.join(', ')} WHERE session_id = ?`, values, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  deleteSession(sessionId) {
    return new Promise((resolve, reject) => {
      // First delete all answers associated with this session
      this.db.run('DELETE FROM answers WHERE session_id = ?', [sessionId], (err) => {
        if (err) {
          reject(err);
        } else {
          // Then delete the session itself
          this.db.run('DELETE FROM sessions WHERE session_id = ?', [sessionId], (err) => {
            if (err) reject(err);
            else resolve();
          });
        }
      });
    });
  }

  // Answers
  getAnswersBySession(sessionId) {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM answers WHERE session_id = ? ORDER BY answered_at', [sessionId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getAnswersByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM answers WHERE player_email = ? ORDER BY answered_at DESC', [email], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  createAnswer(answer) {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO answers (session_id, player_email, question_id, selected_answer, is_correct, answered_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        answer.session_id,
        answer.player_email,
        answer.question_id,
        answer.selected_answer,
        answer.is_correct,
        answer.answered_at
      ], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  }

  // Analytics
  getLeaderboard(limit = 10) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT player_email, MAX(final_score) as best_score, COUNT(*) as total_games, 
               SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_games
        FROM sessions
        GROUP BY player_email
        ORDER BY best_score DESC
        LIMIT ?
      `, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getSessionStats() {
    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT 
          COUNT(*) as total_sessions,
          SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_sessions,
          AVG(final_score) as avg_score,
          MAX(final_score) as max_score
        FROM sessions
      `, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  getQuestionStats() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          q.id,
          q.question,
          q.section,
          COUNT(a.id) as times_answered,
          SUM(CASE WHEN a.is_correct = 1 THEN 1 ELSE 0 END) as correct_count,
          ROUND(AVG(a.is_correct) * 100, 2) as accuracy_percentage
        FROM questions q
        LEFT JOIN answers a ON q.id = a.question_id
        WHERE q.active = 1
        GROUP BY q.id
        ORDER BY times_answered DESC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

// Singleton instance
let dbInstance = null;

const getDatabase = () => {
  if (!dbInstance) {
    dbInstance = new Database();
  }
  return dbInstance;
};

module.exports = { getDatabase };
