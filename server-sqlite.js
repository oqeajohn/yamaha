const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const { getDatabase } = require('./admin/data/database');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'yamaha-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Initialize database
let db;
(async () => {
    try {
        db = getDatabase();
        await db.connect();
        console.log('✓ Connected to SQLite database');
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
})();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    if (db) {
        await db.close();
    }
    process.exit(0);
});

// Serve Vue.js admin panel
app.get('/admin', (req, res) => {
    res.redirect('/admin/login-vue.html');
});

// Admin credentials (use environment variables in production)
const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD_HASH || '$2b$10$qslIgU87Hw/v2cIPxRLWN.VpUjNx4/XKwHUBRdoQZ0TInBN5A7UgC' // password: YamahaAdmin2024@Prod
};

// Helper function to update quiz JSON file for the game
async function updateQuizJSON() {
    try {
        const questions = await db.getAllQuestions();
        
        const gameQuestions = questions.map(q => ({
            id: parseInt(q.id),
            section: q.section,
            question: q.question,
            options: [q.option_a, q.option_b],
            correct: parseInt(q.correct_answer),
            explanation: q.explanation || ''
        }));
        
        const quizData = {questions: gameQuestions};
        const quizFile = path.join(__dirname, 'quiz-questions.json');
        await fs.writeFile(quizFile, JSON.stringify(quizData, null, 2));
    } catch (error) {
        console.error('Error updating quiz JSON:', error);
    }
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
    try {
        const {username, password} = req.body;
        
        if (username === ADMIN_CREDENTIALS.username && await bcrypt.compare(password, ADMIN_CREDENTIALS.password)) {
            const token = jwt.sign({username}, SECRET_KEY, {expiresIn: '24h'});
            res.json({success: true, token});
        } else {
            res.status(401).json({success: false, message: 'Invalid credentials'});
        }
    } catch (error) {
        res.status(500).json({success: false, message: 'Server error'});
    }
});

app.post('/api/logout', (req, res) => {
    res.json({success: true, message: 'Logged out successfully'});
});

// ===== QUESTION ROUTES =====

app.get('/api/questions', authenticateToken, async (req, res) => {
    try {
        const questions = await db.getAllQuestions();
        res.json({success: true, questions});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error fetching questions'});
    }
});

app.post('/api/questions', authenticateToken, async (req, res) => {
    try {
        const {section, question, explanation, option_a, option_b, correct_answer} = req.body;
        
        if (!section || !question || !option_a || !option_b || correct_answer === undefined) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        }
        
        const result = await db.createQuestion({
            section,
            question,
            explanation,
            option_a,
            option_b,
            correct_answer: parseInt(correct_answer)
        });
        
        await updateQuizJSON();
        
        res.json({
            success: true,
            message: 'Question added successfully',
            question: {id: result.id}
        });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({success: false, message: 'Error adding question'});
    }
});

app.put('/api/questions/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {section, question, explanation, option_a, option_b, correct_answer} = req.body;
        
        const existing = await db.getQuestionById(id);
        if (!existing) {
            return res.status(404).json({success: false, message: 'Question not found'});
        }
        
        await db.updateQuestion(id, {
            section,
            question,
            explanation,
            option_a,
            option_b,
            correct_answer: parseInt(correct_answer)
        });
        
        await updateQuizJSON();
        
        res.json({success: true, message: 'Question updated successfully'});
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({success: false, message: 'Error updating question'});
    }
});

app.delete('/api/questions/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        const existing = await db.getQuestionById(id);
        if (!existing) {
            return res.status(404).json({success: false, message: 'Question not found'});
        }
        
        await db.deleteQuestion(id);
        await updateQuizJSON();
        
        res.json({success: true, message: 'Question deleted successfully'});
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({success: false, message: 'Error deleting question'});
    }
});

// ===== GAME ROUTES =====

app.get('/api/game/questions', async (req, res) => {
    try {
        const questions = await db.getAllQuestions();
        
        const gameQuestions = questions.map(q => ({
            id: parseInt(q.id),
            section: q.section,
            question: q.question,
            options: [q.option_a, q.option_b],
            correct: parseInt(q.correct_answer),
            explanation: q.explanation || ''
        }));
        
        res.json({success: true, questions: gameQuestions});
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({success: false, message: 'Error fetching questions'});
    }
});

// Kamote messages - still using JSON for now
const DATA_DIR = path.join(__dirname, 'admin', 'data');

async function readJSON(filename) {
    try {
        const filepath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filepath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return {messages: []};
    }
}

async function writeJSON(filename, data) {
    try {
        const filepath = path.join(DATA_DIR, filename);
        await fs.copyFile(filepath, `${filepath}.backup`).catch(() => {});
        await fs.writeFile(filepath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        throw error;
    }
}

app.get('/api/game/kamote-messages', async (req, res) => {
    try {
        const data = await readJSON('kamote_messages.json');
        const activeMessages = (data.messages || []).filter(m => m.active === 1);
        res.json({success: true, messages: activeMessages});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error fetching messages'});
    }
});

app.get('/api/kamote-messages', authenticateToken, async (req, res) => {
    try {
        const data = await readJSON('kamote_messages.json');
        res.json({success: true, messages: data.messages || []});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error fetching messages'});
    }
});

app.post('/api/kamote-messages', authenticateToken, async (req, res) => {
    try {
        const {message} = req.body;
        if (!message) {
            return res.status(400).json({success: false, message: 'Message is required'});
        }
        
        const data = await readJSON('kamote_messages.json');
        const messages = data.messages || [];
        const nextId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
        
        const newMessage = {
            id: nextId,
            message,
            active: 1,
            created_at: new Date().toISOString()
        };
        
        messages.push(newMessage);
        await writeJSON('kamote_messages.json', {messages});
        
        res.json({success: true, message: 'Message added successfully', data: newMessage});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error adding message'});
    }
});

app.put('/api/kamote-messages/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {message, active} = req.body;
        
        const data = await readJSON('kamote_messages.json');
        const messages = data.messages || [];
        const index = messages.findIndex(m => m.id === id);
        
        if (index === -1) {
            return res.status(404).json({success: false, message: 'Message not found'});
        }
        
        if (message !== undefined) messages[index].message = message;
        if (active !== undefined) messages[index].active = active;
        
        await writeJSON('kamote_messages.json', {messages});
        res.json({success: true, message: 'Message updated successfully'});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error updating message'});
    }
});

app.delete('/api/kamote-messages/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await readJSON('kamote_messages.json');
        const messages = data.messages || [];
        const index = messages.findIndex(m => m.id === id);
        
        if (index === -1) {
            return res.status(404).json({success: false, message: 'Message not found'});
        }
        
        messages[index].active = 0;
        await writeJSON('kamote_messages.json', {messages});
        res.json({success: true, message: 'Message deleted successfully'});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error deleting message'});
    }
});

// ===== SESSION ROUTES =====

app.post('/api/sessions/start', async (req, res) => {
    try {
        const {player_email, ip_address, user_agent} = req.body;
        
        if (!player_email) {
            return res.status(400).json({success: false, message: 'Player email is required'});
        }
        
        const crypto = require('crypto');
        const session_id = crypto.randomBytes(32).toString('hex');
        
        const result = await db.createSession({
            session_id,
            player_email,
            start_time: new Date().toISOString(),
            ip_address,
            user_agent
        });
        
        res.json({success: true, session_id});
    } catch (error) {
        console.error('Error starting session:', error);
        res.status(500).json({success: false, message: 'Error starting session'});
    }
});

app.post('/api/sessions/answer', async (req, res) => {
    try {
        const {session_id, player_email, question_id, selected_answer, is_correct} = req.body;
        
        if (!session_id || !player_email || question_id === undefined || selected_answer === undefined) {
            return res.status(400).json({success: false, message: 'Missing required fields'});
        }
        
        await db.createAnswer({
            session_id,
            player_email,
            question_id: parseInt(question_id),
            selected_answer: parseInt(selected_answer),
            is_correct: is_correct ? 1 : 0,
            answered_at: new Date().toISOString()
        });
        
        res.json({success: true, message: 'Answer recorded'});
    } catch (error) {
        console.error('Error recording answer:', error);
        res.status(500).json({success: false, message: 'Error recording answer'});
    }
});

app.post('/api/sessions/end', async (req, res) => {
    try {
        const {session_id, final_score, fuel_remaining} = req.body;
        
        if (!session_id) {
            return res.status(400).json({success: false, message: 'Session ID is required'});
        }
        
        await db.updateSession(session_id, {
            end_time: new Date().toISOString(),
            final_score: parseInt(final_score) || 0,
            fuel_remaining: parseInt(fuel_remaining) || 0,
            completed: 1
        });
        
        res.json({success: true, message: 'Session ended successfully'});
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({success: false, message: 'Error ending session'});
    }
});

app.get('/api/sessions', authenticateToken, async (req, res) => {
    try {
        const sessions = await db.getAllSessions();
        res.json({success: true, sessions});
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({success: false, message: 'Error fetching sessions'});
    }
});

app.get('/api/sessions/:session_id/details', authenticateToken, async (req, res) => {
    try {
        const {session_id} = req.params;
        
        const session = await db.getSessionById(session_id);
        if (!session) {
            return res.status(404).json({success: false, message: 'Session not found'});
        }
        
        const answers = await db.getAnswersBySession(session_id);
        
        res.json({
            success: true,
            session,
            answers
        });
    } catch (error) {
        console.error('Error fetching session details:', error);
        res.status(500).json({success: false, message: 'Error fetching session details'});
    }
});

app.delete('/api/sessions/:session_id', authenticateToken, async (req, res) => {
    try {
        const {session_id} = req.params;
        
        const session = await db.getSessionById(session_id);
        if (!session) {
            return res.status(404).json({success: false, message: 'Session not found'});
        }
        
        await db.deleteSession(session_id);
        res.json({success: true, message: 'Session deleted successfully'});
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({success: false, message: 'Error deleting session'});
    }
});

// ===== ANALYTICS ROUTES =====

app.get('/api/analytics', authenticateToken, async (req, res) => {
    try {
        const stats = await db.getSessionStats();
        const leaderboard = await db.getLeaderboard(10);
        const questionStats = await db.getQuestionStats();
        
        res.json({
            success: true,
            stats: {
                totalSessions: stats.total_sessions,
                completedSessions: stats.completed_sessions,
                averageScore: Math.round(stats.avg_score || 0),
                highestScore: stats.max_score || 0
            },
            leaderboard,
            questionStats
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({success: false, message: 'Error fetching analytics'});
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin API ready (SQLite)`);
    console.log(`🎮 Game API ready`);
    updateQuizJSON();
});
