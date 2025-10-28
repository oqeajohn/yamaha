const API_URL = 'http://localhost:3000/api';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    return token;
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = checkAuth();
    if (!token) return;
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_username');
            window.location.href = 'login.html';
            return null;
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        alert('Connection error. Make sure the server is running on port 3000.');
        return null;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('admin_username');
    if (username) {
        document.getElementById('username').textContent = username;
    }
    
    loadStats();
    loadQuestions();
});

// Logout
function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    window.location.href = 'login.html';
}

// Tab switching
function switchTab(tabName, button) {
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (button) {
        button.classList.add('active');
    } else {
        document.querySelector(`[onclick*="${tabName}"]`).classList.add('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    
    // Load content based on tab
    if (tabName === 'questions') loadQuestions();
    if (tabName === 'sessions') loadSessions();
    if (tabName === 'analytics') loadAnalytics();
}

// Load statistics
async function loadStats() {
    const data = await apiRequest('/stats');
    if (data && data.success) {
        const stats = data.stats;
        document.getElementById('stat-questions').textContent = stats.total_questions;
        document.getElementById('stat-sessions').textContent = stats.total_sessions;
        document.getElementById('stat-completed').textContent = stats.completed_sessions;
        
        const accuracy = stats.total_answers > 0 
            ? ((stats.correct_answers / stats.total_answers) * 100).toFixed(1)
            : 0;
        document.getElementById('stat-accuracy').textContent = accuracy + '%';
    }
}

// Load questions
async function loadQuestions() {
    const data = await apiRequest('/questions');
    if (data && data.success) {
        displayQuestions(data.questions);
    }
}

function displayQuestions(questions) {
    const html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Section</th>
                    <th>Question</th>
                    <th>Options</th>
                    <th>Correct</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${questions.map(q => `
                    <tr>
                        <td>${q.id}</td>
                        <td>${q.section}</td>
                        <td>${q.question.substring(0, 50)}...</td>
                        <td>A: ${q.option_a}<br>B: ${q.option_b}</td>
                        <td><span class="badge badge-success">${q.correct_answer == 0 ? 'A' : 'B'}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick='editQuestion(${JSON.stringify(q)})'>Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteQuestion(${q.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('questionsList').innerHTML = html;
}

// Question modal
function openQuestionModal(question = null) {
    document.getElementById('questionModal').classList.add('active');
    document.getElementById('questionForm').reset();
    
    if (question) {
        document.getElementById('modalTitle').textContent = 'Edit Question';
        document.getElementById('questionId').value = question.id;
        document.getElementById('section').value = question.section;
        document.getElementById('question').value = question.question;
        document.getElementById('optionA').value = question.option_a;
        document.getElementById('optionB').value = question.option_b;
        document.getElementById('correctAnswer').value = question.correct_answer;
        document.getElementById('explanation').value = question.explanation || '';
    } else {
        document.getElementById('modalTitle').textContent = 'Add Question';
    }
}

function closeQuestionModal() {
    document.getElementById('questionModal').classList.remove('active');
}

function editQuestion(question) {
    openQuestionModal(question);
}

async function deleteQuestion(id) {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    const data = await apiRequest(`/questions/${id}`, {
        method: 'DELETE'
    });
    
    if (data && data.success) {
        alert(data.message);
        loadQuestions();
        loadStats();
    }
}

// Question form submission
document.getElementById('questionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const questionData = Object.fromEntries(formData);
    const questionId = document.getElementById('questionId').value;
    
    let data;
    if (questionId) {
        // Update existing
        data = await apiRequest(`/questions/${questionId}`, {
            method: 'PUT',
            body: JSON.stringify(questionData)
        });
    } else {
        // Add new
        data = await apiRequest('/questions', {
            method: 'POST',
            body: JSON.stringify(questionData)
        });
    }
    
    if (data && data.success) {
        alert(data.message);
        closeQuestionModal();
        loadQuestions();
        loadStats();
    }
});

// Load sessions
async function loadSessions() {
    document.getElementById('sessionsList').innerHTML = '<div class="loading">Loading sessions...</div>';
    const data = await apiRequest('/sessions');
    if (data && data.success) {
        displaySessions(data.sessions);
    }
}

function displaySessions(sessions) {
    if (sessions.length === 0) {
        document.getElementById('sessionsList').innerHTML = '<p>No sessions yet.</p>';
        return;
    }
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>Session ID</th>
                    <th>Start Time</th>
                    <th>Final Score</th>
                    <th>Completed</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${sessions.map(s => `
                    <tr>
                        <td>${s.session_id.substring(0, 12)}...</td>
                        <td>${new Date(s.start_time).toLocaleString()}</td>
                        <td>${s.final_score}</td>
                        <td><span class="badge ${s.completed ? 'badge-success' : 'badge-danger'}">${s.completed ? 'Yes' : 'No'}</span></td>
                        <td><button class="btn btn-sm btn-primary" onclick="viewSessionDetails('${s.session_id}')">View Details</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('sessionsList').innerHTML = html;
}

async function viewSessionDetails(sessionId) {
    const data = await apiRequest(`/sessions/${sessionId}/details`);
    if (data && data.success) {
        if (data.details.length === 0) {
            alert('No answers recorded for this session.');
            return;
        }
        
        const details = data.details.map(d => {
            // Use the options as they were at the time of answering (from the answer record)
            const selectedLetter = d.selected_answer === 0 ? 'A' : 'B';
            const selectedOption = d.selected_answer === 0 ? d.option_a : d.option_b;
            
            // Determine what the correct answer was based on is_correct flag
            let correctLetter, correctOption;
            if (d.is_correct) {
                // If they got it correct, the selected answer was the correct one
                correctLetter = selectedLetter;
                correctOption = selectedOption;
            } else {
                // If they got it wrong, the correct answer is the other option
                correctLetter = d.selected_answer === 0 ? 'B' : 'A';
                correctOption = d.selected_answer === 0 ? d.option_b : d.option_a;
            }
            
            return `Question: ${d.question}\nSelected: ${selectedLetter} - ${selectedOption}\nCorrect Answer: ${correctLetter} - ${correctOption}\nStatus: ${d.is_correct ? '✓ Correct' : '✗ Wrong'}`;
        }).join('\n\n');
        
    }
}

// Load analytics
async function loadAnalytics() {
    document.getElementById('analyticsContent').innerHTML = '<div class="loading">Loading analytics...</div>';
    const data = await apiRequest('/analytics');
    if (data && data.success) {
        displayAnalytics(data.analytics);
    }
}

function displayAnalytics(analytics) {
    if (analytics.length === 0) {
        document.getElementById('analyticsContent').innerHTML = '<p>No analytics data yet.</p>';
        return;
    }
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>Question</th>
                    <th>Times Asked</th>
                    <th>Correct Answers</th>
                    <th>Accuracy</th>
                </tr>
            </thead>
            <tbody>
                ${analytics.map(a => `
                    <tr>
                        <td>${a.question}</td>
                        <td>${a.times_asked}</td>
                        <td>${a.correct_count}</td>
                        <td><span class="badge ${a.accuracy >= 50 ? 'badge-success' : 'badge-danger'}">${a.accuracy}%</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('analyticsContent').innerHTML = html;
}
