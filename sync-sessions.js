const fs = require('fs');

// Read both files
const answers = JSON.parse(fs.readFileSync('answers.json', 'utf8'));
const sessions = JSON.parse(fs.readFileSync('sessions.json', 'utf8'));

// Get all unique session_ids from answers.json
const answerSessionIds = new Set(answers.answers.map(a => a.session_id));

// Get all session_ids that already exist in sessions.json
const existingSessionIds = new Set(sessions.sessions.map(s => s.session_id));

// Find session_ids that are in answers but not in sessions
const missingSessionIds = [...answerSessionIds].filter(id => !existingSessionIds.has(id));

console.log(`Total unique sessions in answers.json: ${answerSessionIds.size}`);
console.log(`Total sessions in sessions.json: ${existingSessionIds.size}`);
console.log(`Missing sessions: ${missingSessionIds.length}`);

// For each missing session, create a session record
const newSessions = [];
let nextId = Math.max(...sessions.sessions.map(s => s.id), 0) + 1;

missingSessionIds.forEach(sessionId => {
  // Get all answers for this session
  const sessionAnswers = answers.answers.filter(a => a.session_id === sessionId);
  
  if (sessionAnswers.length === 0) return;
  
  // Get the player email and timestamps
  const playerEmail = sessionAnswers[0].player_email;
  const firstAnswerTime = sessionAnswers[0].answered_at;
  const lastAnswerTime = sessionAnswers[sessionAnswers.length - 1].answered_at;
  
  // Calculate if completed (5 questions answered)
  const completed = sessionAnswers.length >= 5 ? 1 : 0;
  
  // Calculate score based on correct answers (each correct = 500 points)
  const correctAnswers = sessionAnswers.filter(a => a.is_correct === 1).length;
  const final_score = correctAnswers * 500;
  
  // Create session record
  const sessionRecord = {
    id: nextId++,
    session_id: sessionId,
    player_email: playerEmail,
    start_time: firstAnswerTime,
    end_time: completed ? lastAnswerTime : null,
    final_score: final_score,
    fuel_remaining: completed ? 100 : 0,
    completed: completed,
    ip_address: "::1", // Default value since we don't have this data
    user_agent: "Mozilla/5.0" // Default value since we don't have this data
  };
  
  newSessions.push(sessionRecord);
});

// Sort new sessions by start_time
newSessions.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

// Combine existing and new sessions, then sort all by start_time
const allSessions = [...newSessions, ...sessions.sessions];
allSessions.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

// Reassign IDs in chronological order
allSessions.forEach((session, index) => {
  session.id = index + 1;
});

// Create new sessions object
const updatedSessions = {
  sessions: allSessions
};

// Write to a new file
fs.writeFileSync('sessions-updated.json', JSON.stringify(updatedSessions, null, 2));

console.log(`\nCreated ${newSessions.length} new session records`);
console.log(`Total sessions in updated file: ${allSessions.length}`);
console.log('Updated sessions written to sessions-updated.json');
