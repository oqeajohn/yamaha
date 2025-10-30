const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
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

// Data directory
const DATA_DIR = path.join(__dirname, 'admin', 'data');

// Admin credentials (use environment variables in production)
const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD_HASH || '$2b$10$qslIgU87Hw/v2cIPxRLWN.VpUjNx4/XKwHUBRdoQZ0TInBN5A7UgC' // password: YamahaAdmin2024@Prod
};

// Helper functions
async function readJSON(filename) {
    try {
        const filepath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filepath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return filename === 'qs.json' ? {questions: []} :
               filename === 'sessions.json' ? {sessions: []} :
               {answers: []};
    }
}

async function writeJSON(filename, data) {
    try {
        const filepath = path.join(DATA_DIR, filename);
        
        // Create backup
        try {
            await fs.copyFile(filepath, `${filepath}.backup`);
        } catch (e) {
            // Backup failed, continue anyway
        }
        
        await fs.writeFile(filepath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        throw error;
    }
}

function getNextId(items) {
    if (!items || items.length === 0) return 1;
    return Math.max(...items.map(item => item.id)) + 1;
}

async function updateQuizJSON() {
    try {
        const data = await readJSON('qs.json');
        const activeQuestions = (data.questions || []).filter(q => q.active === 1);
        
        const gameQuestions = activeQuestions.map(q => ({
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
        const data = await readJSON('qs.json');
        const activeQuestions = (data.questions || []).filter(q => q.active === 1);
        res.json({success: true, questions: activeQuestions});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.post('/api/questions', authenticateToken, async (req, res) => {
    try {
        const data = await readJSON('qs.json');
        const newQuestion = {
            id: getNextId(data.questions || []),
            section: req.body.section,
            question: req.body.question,
            option_a: req.body.option_a,
            option_b: req.body.option_b,
            correct_answer: parseInt(req.body.correct_answer),
            explanation: req.body.explanation || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            active: 1
        };
        
        data.questions = data.questions || [];
        data.questions.push(newQuestion);
        await writeJSON('qs.json', data);
        await updateQuizJSON();
        
        res.json({success: true, message: 'Question added successfully', question: newQuestion});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.put('/api/questions/:id', authenticateToken, async (req, res) => {
    try {
        const data = await readJSON('qs.json');
        const questionId = parseInt(req.params.id);
        const index = data.questions.findIndex(q => q.id === questionId);
        
        if (index === -1) {
            return res.status(404).json({success: false, message: 'Question not found'});
        }
        
        data.questions[index] = {
            ...data.questions[index],
            section: req.body.section,
            question: req.body.question,
            option_a: req.body.option_a,
            option_b: req.body.option_b,
            correct_answer: parseInt(req.body.correct_answer),
            explanation: req.body.explanation || '',
            updated_at: new Date().toISOString()
        };
        
        await writeJSON('qs.json', data);
        await updateQuizJSON();
        
        res.json({success: true, message: 'Question updated successfully'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.delete('/api/questions/:id', authenticateToken, async (req, res) => {
    try {
        const data = await readJSON('qs.json');
        const questionId = parseInt(req.params.id);
        const index = data.questions.findIndex(q => q.id === questionId);
        
        if (index === -1) {
            return res.status(404).json({success: false, message: 'Question not found'});
        }
        
        data.questions[index].active = 0;
        await writeJSON('qs.json', data);
        await updateQuizJSON();
        
        res.json({success: true, message: 'Question deleted successfully'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// ===== PUBLIC ROUTES (for game) =====

app.get('/api/game/questions', async (req, res) => {
    try {
        const data = await readJSON('qs.json');
        const activeQuestions = (data.questions || []).filter(q => q.active === 1);
        
        const gameQuestions = activeQuestions.map(q => ({
            id: parseInt(q.id),
            section: q.section,
            question: q.question,
            options: [q.option_a, q.option_b],
            correct: parseInt(q.correct_answer),
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
        const data = await readJSON('kamote_messages.json');
        const activeMessages = (data.messages || []).filter(m => m.active === 1);
        res.json({success: true, messages: activeMessages});
    } catch (error) {
        res.status(500).json({success: false, error: 'Failed to load kamote messages'});
    }
});

// ===== KAMOTE MESSAGES ROUTES (Admin) =====

app.get('/api/kamote-messages', authenticateToken, async (req, res) => {
    try {
        const data = await readJSON('kamote_messages.json');
        res.json({success: true, messages: data.messages || []});
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
        
        const data = await readJSON('kamote_messages.json');
        const newId = getNextId(data.messages || []);
        
        const newMessage = {
            id: newId,
            message: message,
            active: active !== undefined ? active : 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        if (!data.messages) data.messages = [];
        data.messages.push(newMessage);
        
        await writeJSON('kamote_messages.json', data);
        
        res.json({success: true, message: 'Kamote message added successfully', kamoteMessage: newMessage});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.put('/api/kamote-messages/:id', authenticateToken, async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        const { message, active } = req.body;
        
        const data = await readJSON('kamote_messages.json');
        const messageIndex = data.messages.findIndex(m => m.id === messageId);
        
        if (messageIndex === -1) {
            return res.status(404).json({success: false, message: 'Kamote message not found'});
        }
        
        if (message !== undefined) data.messages[messageIndex].message = message;
        if (active !== undefined) data.messages[messageIndex].active = active;
        data.messages[messageIndex].updated_at = new Date().toISOString();
        
        await writeJSON('kamote_messages.json', data);
        
        res.json({success: true, message: 'Kamote message updated successfully', kamoteMessage: data.messages[messageIndex]});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.delete('/api/kamote-messages/:id', authenticateToken, async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        
        const data = await readJSON('kamote_messages.json');
        const messageIndex = data.messages.findIndex(m => m.id === messageId);
        
        if (messageIndex === -1) {
            return res.status(404).json({success: false, message: 'Kamote message not found'});
        }
        
        data.messages.splice(messageIndex, 1);
        await writeJSON('kamote_messages.json', data);
        
        res.json({success: true, message: 'Kamote message deleted successfully'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// ===== SESSION TRACKING ROUTES =====

app.post('/api/sessions/start', async (req, res) => {
    try {
        const { email } = req.body;
        const data = await readJSON('sessions.json');
        const sessionId = require('crypto').randomBytes(32).toString('hex');
        
        const newSession = {
            id: getNextId(data.sessions || []),
            session_id: sessionId,
            player_email: email || null,
            start_time: new Date().toISOString(),
            end_time: null,
            final_score: 0,
            fuel_remaining: 0,
            completed: 0,
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        };
        
        data.sessions = data.sessions || [];
        data.sessions.push(newSession);
        await writeJSON('sessions.json', data);
        
        res.json({success: true, session_id: sessionId});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.post('/api/sessions/answer', async (req, res) => {
    try {
        const {session_id, question_id, selected_answer, is_correct, email} = req.body;
        const data = await readJSON('answers.json');
        
        const newAnswer = {
            id: getNextId(data.answers || []),
            session_id,
            player_email: email || null,
            question_id: parseInt(question_id),
            selected_answer: parseInt(selected_answer),
            is_correct: is_correct ? 1 : 0,
            answered_at: new Date().toISOString()
        };
        
        data.answers = data.answers || [];
        data.answers.push(newAnswer);
        await writeJSON('answers.json', data);
        
        res.json({success: true, message: 'Answer recorded'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.post('/api/sessions/end', async (req, res) => {
    try {
        const {session_id, final_score, fuel_remaining, completed, email} = req.body;
        const data = await readJSON('sessions.json');
        
        const session = data.sessions.find(s => s.session_id === session_id);
        if (session) {
            session.end_time = new Date().toISOString();
            session.final_score = parseInt(final_score);
            session.fuel_remaining = parseInt(fuel_remaining);
            session.completed = completed ? 1 : 0;
            if (email && !session.player_email) {
                session.player_email = email;
            }
            
            await writeJSON('sessions.json', data);
        }
        
        res.json({success: true, message: 'Session ended'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// ===== ADMIN ANALYTICS ROUTES =====

app.get('/api/sessions', authenticateToken, async (req, res) => {
    try {
        const data = await readJSON('sessions.json');
        const sessions = (data.sessions || [])
            .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
            .slice(0, 100);
        
        res.json({success: true, sessions});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.get('/api/sessions/:session_id/details', authenticateToken, async (req, res) => {
    try {
        const answersData = await readJSON('answers.json');
        const questionsData = await readJSON('qs.json');
        
        const sessionAnswers = (answersData.answers || [])
            .filter(a => a.session_id === req.params.session_id);
        
        const details = sessionAnswers.map(answer => {
            const question = questionsData.questions.find(q => q.id === answer.question_id);
            return {
                ...answer,
                question: question?.question,
                option_a: question?.option_a,
                option_b: question?.option_b
            };
        });
        
        res.json({success: true, details});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.delete('/api/sessions/:session_id', authenticateToken, async (req, res) => {
    try {
        const sessionId = req.params.session_id;
        
        // Delete session from sessions.json
        const sessionsData = await readJSON('sessions.json');
        const originalSessionsCount = sessionsData.sessions.length;
        sessionsData.sessions = sessionsData.sessions.filter(s => s.session_id !== sessionId);
        await writeJSON('sessions.json', sessionsData);
        
        // Delete related answers from answers.json
        const answersData = await readJSON('answers.json');
        const originalAnswersCount = answersData.answers.length;
        answersData.answers = answersData.answers.filter(a => a.session_id !== sessionId);
        await writeJSON('answers.json', answersData);
        
        const sessionsDeleted = originalSessionsCount - sessionsData.sessions.length;
        const answersDeleted = originalAnswersCount - answersData.answers.length;
        
        res.json({
            success: true, 
            message: `Session deleted successfully (${sessionsDeleted} session, ${answersDeleted} answers removed)`
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.post('/api/backup-sessions', authenticateToken, async (req, res) => {
    try {
        const filepath = path.join(DATA_DIR, 'sessions.json');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(DATA_DIR, `sessions_backup_${timestamp}.json`);
        
        // Copy current sessions.json to timestamped backup
        await fs.copyFile(filepath, backupPath);
        
        // Also update the regular .backup file
        await fs.copyFile(filepath, `${filepath}.backup`);
        
        res.json({
            success: true, 
            message: `Backup created successfully: sessions_backup_${timestamp}.json`,
            timestamp
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

app.get('/api/analytics', authenticateToken, async (req, res) => {
    try {
        const questionsData = await readJSON('qs.json');
        const answersData = await readJSON('answers.json');
        
        const analytics = (questionsData.questions || [])
            .filter(q => q.active === 1)
            .map(q => {
                const questionAnswers = (answersData.answers || [])
                    .filter(a => a.question_id === q.id);
                
                const timesAsked = questionAnswers.length;
                const correctCount = questionAnswers.filter(a => a.is_correct === 1).length;
                const accuracy = timesAsked > 0 ? Math.round((correctCount / timesAsked) * 100 * 10) / 10 : 0;
                
                return {
                    id: q.id,
                    section: q.section,
                    question: q.question,
                    times_asked: timesAsked,
                    correct_count: correctCount,
                    accuracy
                };
            })
            .sort((a, b) => b.times_asked - a.times_asked);
        
        res.json({success: true, analytics});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// ===== STATISTICS =====

app.get('/api/stats', authenticateToken, async (req, res) => {
    try {
        const questionsData = await readJSON('qs.json');
        const sessionsData = await readJSON('sessions.json');
        const answersData = await readJSON('answers.json');
        
        const stats = {
            total_questions: (questionsData.questions || []).filter(q => q.active === 1).length,
            total_sessions: (sessionsData.sessions || []).length,
            completed_sessions: (sessionsData.sessions || []).filter(s => s.completed === 1).length,
            total_answers: (answersData.answers || []).length,
            correct_answers: (answersData.answers || []).filter(a => a.is_correct === 1).length
        };
        
        res.json({success: true, stats});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// ===== PLAYER MANAGEMENT =====

// Register or get player by email
app.post('/api/players/register', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({success: false, message: 'Valid email is required'});
        }
        
        const playersData = await readJSON('players.json');
        
        // Check if player exists
        let player = playersData.players.find(p => p.email === email);
        
        if (player) {
            // Existing player
            res.json({
                success: true, 
                player: player,
                message: 'Welcome back!'
            });
        } else {
            // New player
            player = {
                email: email,
                registered_at: new Date().toISOString(),
                sessions: [],
                has_redirected: false
            };
            
            playersData.players.push(player);
            await writeJSON('players.json', playersData);
            
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

// Get player by email
app.get('/api/players/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const playersData = await readJSON('players.json');
        
        const player = playersData.players.find(p => p.email === email);
        
        if (player) {
            res.json({success: true, player});
        } else {
            res.status(404).json({success: false, message: 'Player not found'});
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// Mark player as redirected (called when Claim Prize is clicked)
app.post('/api/players/:email/redirect', async (req, res) => {
    try {
        const { email } = req.params;
        const playersData = await readJSON('players.json');
        
        const playerIndex = playersData.players.findIndex(p => p.email === email);
        
        if (playerIndex !== -1) {
            playersData.players[playerIndex].has_redirected = true;
            playersData.players[playerIndex].redirected_at = new Date().toISOString();
            await writeJSON('players.json', playersData);
            
            res.json({success: true, message: 'Redirect recorded'});
        } else {
            res.status(404).json({success: false, message: 'Player not found'});
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// Add session to player
app.post('/api/players/:email/sessions', async (req, res) => {
    try {
        const { email } = req.params;
        const { session_id, score } = req.body;
        const playersData = await readJSON('players.json');
        
        const playerIndex = playersData.players.findIndex(p => p.email === email);
        
        if (playerIndex !== -1) {
            if (!playersData.players[playerIndex].sessions) {
                playersData.players[playerIndex].sessions = [];
            }
            
            playersData.players[playerIndex].sessions.push({
                session_id: session_id,
                score: score,
                played_at: new Date().toISOString()
            });
            
            await writeJSON('players.json', playersData);
            
            res.json({success: true, message: 'Session recorded'});
        } else {
            res.status(404).json({success: false, message: 'Player not found'});
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// Clear all sessions and answers (keep questions)
app.delete('/api/clear-data', async (req, res) => {
    try {
        // Clear sessions
        await writeJSON('sessions.json', { sessions: [] });
        
        // Clear answers
        await writeJSON('answers.json', { answers: [] });
        
        // Clear players
        await writeJSON('players.json', { players: [] });
        
        res.json({
            success: true, 
            message: 'All sessions, answers, and players cleared successfully. Questions retained.'
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin API ready`);
    console.log(`🎮 Game API ready`);
});
