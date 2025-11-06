const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'yamaha-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Serve Vue.js admin panel
app.get('/admin', (req, res) => {
    res.redirect('/admin/login-vue.html');
});

// Database setup
const DB_PATH = path.join(__dirname, 'admin', 'data', 'yamaha.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

// Admin credentials (use environment variables in production)
const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD_HASH || '$2b$10$qslIgU87Hw/v2cIPxRLWN.VpUjNx4/XKwHUBRdoQZ0TInBN5A7UgC' // password: YamahaAdmin2024@Prod
};

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        // Questions table
        db.run(`CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section TEXT NOT NULL,
            question TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            correct_answer INTEGER NOT NULL,
            explanation TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            active INTEGER DEFAULT 1
        )`);

        // Sessions table
        db.run(`CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE NOT NULL,
            player_email TEXT,
            start_time TEXT DEFAULT CURRENT_TIMESTAMP,
            end_time TEXT,
            final_score INTEGER DEFAULT 0,
            fuel_remaining INTEGER DEFAULT 0,
            completed INTEGER DEFAULT 0,
            ip_address TEXT,
            user_agent TEXT
        )`);

        // Answers table
        db.run(`CREATE TABLE IF NOT EXISTS answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            player_email TEXT,
            question_id INTEGER NOT NULL,
            selected_answer INTEGER NOT NULL,
            is_correct INTEGER NOT NULL,
            answered_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions(session_id),
            FOREIGN KEY (question_id) REFERENCES questions(id)
        )`);

        // Players table
        db.run(`CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            registered_at TEXT DEFAULT CURRENT_TIMESTAMP,
            has_redirected INTEGER DEFAULT 0,
            redirected_at TEXT
        )`);

        // Kamote messages table
        db.run(`CREATE TABLE IF NOT EXISTS kamote_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log('✅ Database tables initialized');
    });
}

// Database helper functions
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

function getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function allQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Auth middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({success: false, message: 'No token provided'});
    }
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({success: false, message: 'Invalid token'});
        }
        req.user = user;
        next();
    });
}

// ===== AUTH ROUTES =====

app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    
    if (username === ADMIN_CREDENTIALS.username && 
        await bcrypt.compare(password, ADMIN_CREDENTIALS.password)) {
        
        const token = jwt.sign({username}, SECRET_KEY, {expiresIn: '24h'});
        res.json({success: true, token, username});
    } else {
        res.status(401).json({success: false, message: 'Invalid credentials'});
    }
});

app.post('/api/logout', (req, res) => {
    res.json({success: true, message: 'Logged out'});
});

// ===== QUESTIONS ROUTES =====

app.get('/api/questions', authenticateToken, async (req, res) => {
    try {
        const questions = await allQuery('SELECT * FROM questions WHERE active = 1 ORDER BY id');
        res.json({success: true, questions});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.post('/api/questions', authenticateToken, async (req, res) => {
    try {
        const { section, question, option_a, option_b, correct_answer, explanation } = req.body;
        
        const result = await runQuery(
            `INSERT INTO questions (section, question, option_a, option_b, correct_answer, explanation, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [section, question, option_a, option_b, correct_answer, explanation || '']
        );
        
        const newQuestion = await getQuery('SELECT * FROM questions WHERE id = ?', [result.id]);
        res.json({success: true, message: 'Question added successfully', question: newQuestion});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.put('/api/questions/:id', authenticateToken, async (req, res) => {
    try {
        const { section, question, option_a, option_b, correct_answer, explanation } = req.body;
        const questionId = parseInt(req.params.id);
        
        await runQuery(
            `UPDATE questions 
             SET section = ?, question = ?, option_a = ?, option_b = ?, 
                 correct_answer = ?, explanation = ?, updated_at = datetime('now')
             WHERE id = ?`,
            [section, question, option_a, option_b, correct_answer, explanation || '', questionId]
        );
        
        res.json({success: true, message: 'Question updated successfully'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.delete('/api/questions/:id', authenticateToken, async (req, res) => {
    try {
        const questionId = parseInt(req.params.id);
        await runQuery('UPDATE questions SET active = 0 WHERE id = ?', [questionId]);
        res.json({success: true, message: 'Question deleted successfully'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// ===== PUBLIC ROUTES (for game) =====

app.get('/api/game/questions', async (req, res) => {
    try {
        const questions = await allQuery('SELECT * FROM questions WHERE active = 1');
        
        const gameQuestions = questions.map(q => ({
            id: q.id,
            section: q.section,
            question: q.question,
            options: [q.option_a, q.option_b],
            correct: q.correct_answer,
            explanation: q.explanation || ''
        }));
        
        res.json({questions: gameQuestions});
    } catch (error) {
        res.status(500).json({error: 'Failed to load questions'});
    }
});

// Get active kamote messages for game
app.get('/api/game/kamote-messages', async (req, res) => {
    try {
        const messages = await allQuery('SELECT * FROM kamote_messages WHERE active = 1');
        res.json({success: true, messages});
    } catch (error) {
        res.status(500).json({success: false, error: 'Failed to load kamote messages'});
    }
});

// ===== KAMOTE MESSAGES ROUTES (Admin) =====

app.get('/api/kamote-messages', authenticateToken, async (req, res) => {
    try {
        const messages = await allQuery('SELECT * FROM kamote_messages ORDER BY id');
        res.json({success: true, messages});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.post('/api/kamote-messages', authenticateToken, async (req, res) => {
    try {
        const { message, active } = req.body;
        
        if (!message) {
            return res.status(400).json({success: false, message: 'Message is required'});
        }
        
        const result = await runQuery(
            `INSERT INTO kamote_messages (message, active, created_at, updated_at)
             VALUES (?, ?, datetime('now'), datetime('now'))`,
            [message, active !== undefined ? active : 1]
        );
        
        const newMessage = await getQuery('SELECT * FROM kamote_messages WHERE id = ?', [result.id]);
        res.json({success: true, message: 'Kamote message added successfully', kamoteMessage: newMessage});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.put('/api/kamote-messages/:id', authenticateToken, async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        const { message, active } = req.body;
        
        const updates = [];
        const params = [];
        
        if (message !== undefined) {
            updates.push('message = ?');
            params.push(message);
        }
        if (active !== undefined) {
            updates.push('active = ?');
            params.push(active);
        }
        
        updates.push("updated_at = datetime('now')");
        params.push(messageId);
        
        await runQuery(
            `UPDATE kamote_messages SET ${updates.join(', ')} WHERE id = ?`,
            params
        );
        
        const updatedMessage = await getQuery('SELECT * FROM kamote_messages WHERE id = ?', [messageId]);
        res.json({success: true, message: 'Kamote message updated successfully', kamoteMessage: updatedMessage});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.delete('/api/kamote-messages/:id', authenticateToken, async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        await runQuery('DELETE FROM kamote_messages WHERE id = ?', [messageId]);
        res.json({success: true, message: 'Kamote message deleted successfully'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// ===== SESSION TRACKING ROUTES =====

app.post('/api/sessions/start', async (req, res) => {
    try {
        const { email } = req.body;
        const sessionId = require('crypto').randomBytes(32).toString('hex');
        
        await runQuery(
            `INSERT INTO sessions (session_id, player_email, start_time, ip_address, user_agent)
             VALUES (?, ?, datetime('now'), ?, ?)`,
            [sessionId, email || null, req.ip, req.headers['user-agent']]
        );
        
        res.json({success: true, session_id: sessionId});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.post('/api/sessions/answer', async (req, res) => {
    try {
        const {session_id, question_id, selected_answer, is_correct, email} = req.body;
        
        await runQuery(
            `INSERT INTO answers (session_id, player_email, question_id, selected_answer, is_correct, answered_at)
             VALUES (?, ?, ?, ?, ?, datetime('now'))`,
            [session_id, email || null, question_id, selected_answer, is_correct ? 1 : 0]
        );
        
        res.json({success: true, message: 'Answer recorded'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.post('/api/sessions/end', async (req, res) => {
    try {
        const {session_id, final_score, fuel_remaining, completed, email} = req.body;
        
        const updates = ['end_time = datetime(\'now\')', 'final_score = ?', 'fuel_remaining = ?', 'completed = ?'];
        const params = [final_score, fuel_remaining, completed ? 1 : 0];
        
        if (email) {
            updates.push('player_email = ?');
            params.push(email);
        }
        
        params.push(session_id);
        
        await runQuery(
            `UPDATE sessions SET ${updates.join(', ')} WHERE session_id = ?`,
            params
        );
        
        res.json({success: true, message: 'Session ended'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// ===== ADMIN ANALYTICS ROUTES =====

app.get('/api/sessions', authenticateToken, async (req, res) => {
    try {
        const sessions = await allQuery('SELECT * FROM sessions ORDER BY start_time DESC');
        res.json({success: true, sessions});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.get('/api/sessions/:session_id/details', authenticateToken, async (req, res) => {
    try {
        const details = await allQuery(
            `SELECT a.*, q.question, q.option_a, q.option_b
             FROM answers a
             LEFT JOIN questions q ON a.question_id = q.id
             WHERE a.session_id = ?`,
            [req.params.session_id]
        );
        
        res.json({success: true, details});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.delete('/api/sessions/:session_id', authenticateToken, async (req, res) => {
    try {
        const sessionId = req.params.session_id;
        
        // Delete related answers
        const answersResult = await runQuery('DELETE FROM answers WHERE session_id = ?', [sessionId]);
        
        // Delete session
        const sessionResult = await runQuery('DELETE FROM sessions WHERE session_id = ?', [sessionId]);
        
        res.json({
            success: true, 
            message: `Session deleted successfully (${sessionResult.changes} session, ${answersResult.changes} answers removed)`
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.post('/api/backup-sessions', authenticateToken, async (req, res) => {
    try {
        // SQLite databases can be backed up by copying the file
        const fs = require('fs').promises;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(__dirname, 'admin', 'data', `yamaha_backup_${timestamp}.db`);
        
        await fs.copyFile(DB_PATH, backupPath);
        
        res.json({
            success: true, 
            message: `Database backup created: yamaha_backup_${timestamp}.db`,
            timestamp
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.get('/api/analytics', authenticateToken, async (req, res) => {
    try {
        const analytics = await allQuery(
            `SELECT 
                q.id,
                q.section,
                q.question,
                COUNT(a.id) as times_asked,
                SUM(CASE WHEN a.is_correct = 1 THEN 1 ELSE 0 END) as correct_count,
                ROUND(
                    CAST(SUM(CASE WHEN a.is_correct = 1 THEN 1 ELSE 0 END) AS FLOAT) / 
                    CAST(COUNT(a.id) AS FLOAT) * 100, 
                    1
                ) as accuracy
             FROM questions q
             LEFT JOIN answers a ON q.id = a.question_id
             WHERE q.active = 1
             GROUP BY q.id
             ORDER BY times_asked DESC`
        );
        
        res.json({success: true, analytics});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// ===== STATISTICS =====

app.get('/api/stats', authenticateToken, async (req, res) => {
    try {
        const totalQuestions = await getQuery('SELECT COUNT(*) as count FROM questions WHERE active = 1');
        const totalSessions = await getQuery('SELECT COUNT(*) as count FROM sessions');
        const completedSessions = await getQuery('SELECT COUNT(*) as count FROM sessions WHERE completed = 1');
        const totalAnswers = await getQuery('SELECT COUNT(*) as count FROM answers');
        const correctAnswers = await getQuery('SELECT COUNT(*) as count FROM answers WHERE is_correct = 1');
        
        res.json({
            success: true,
            stats: {
                total_questions: totalQuestions.count,
                total_sessions: totalSessions.count,
                completed_sessions: completedSessions.count,
                total_answers: totalAnswers.count,
                correct_answers: correctAnswers.count
            }
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// ===== PLAYER MANAGEMENT =====

app.post('/api/players/register', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({success: false, message: 'Valid email is required'});
        }
        
        // Check if player exists
        let player = await getQuery('SELECT * FROM players WHERE email = ?', [email]);
        
        if (player) {
            res.json({
                success: true, 
                player: player,
                message: 'Welcome back!'
            });
        } else {
            // New player
            await runQuery(
                'INSERT INTO players (email, registered_at) VALUES (?, datetime(\'now\'))',
                [email]
            );
            
            player = await getQuery('SELECT * FROM players WHERE email = ?', [email]);
            
            res.json({
                success: true, 
                player: player,
                message: 'Registration successful!'
            });
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.get('/api/players/:email', async (req, res) => {
    try {
        const player = await getQuery('SELECT * FROM players WHERE email = ?', [req.params.email]);
        
        if (player) {
            res.json({success: true, player});
        } else {
            res.status(404).json({success: false, message: 'Player not found'});
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.post('/api/players/:email/redirect', async (req, res) => {
    try {
        const { email } = req.params;
        
        await runQuery(
            'UPDATE players SET has_redirected = 1, redirected_at = datetime(\'now\') WHERE email = ?',
            [email]
        );
        
        res.json({success: true, message: 'Redirect recorded'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.post('/api/players/:email/sessions', async (req, res) => {
    try {
        const { email } = req.params;
        const { session_id, score } = req.body;
        
        // In SQLite, we track sessions in the sessions table with player_email
        // This endpoint is kept for API compatibility but doesn't need to do anything
        // since sessions are already linked to players via email in the sessions table
        
        res.json({success: true, message: 'Session recorded'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// Clear all sessions and answers (keep questions)
app.delete('/api/clear-data', async (req, res) => {
    try {
        await runQuery('DELETE FROM answers');
        await runQuery('DELETE FROM sessions');
        await runQuery('DELETE FROM players');
        
        res.json({
            success: true, 
            message: 'All sessions, answers, and players cleared successfully. Questions retained.'
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('❌ Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin API ready (SQLite)`);
    console.log(`🎮 Game API ready`);
    console.log(`💾 Database: ${DB_PATH}`);
});
