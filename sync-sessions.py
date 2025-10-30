#!/usr/bin/env python3
import json
from datetime import datetime
from collections import defaultdict

# Read both files
print("Reading answers-clean.json...")
try:
    with open('answers-clean.json', 'r', encoding='utf-8') as f:
        content = f.read()
        # Try to fix common JSON issues
        content = content.replace('\n', ' ')
        content = ' '.join(content.split())
        answers_data = json.loads(content)
except Exception as e:
    print(f"Error reading answers-clean.json: {e}")
    # Try alternative approach
    with open('answers-clean.json', 'r', encoding='utf-8') as f:
        lines = []
        for line in f:
            # Skip lines that might be error messages
            if 'channel' not in line and 'open failed' not in line:
                lines.append(line)
        content = ''.join(lines)
        answers_data = json.loads(content)

print("Reading sessions.json...")
with open('sessions.json', 'r', encoding='utf-8') as f:
    sessions_data = json.loads(f.read())

answers = answers_data['answers']
sessions = sessions_data['sessions']

print(f"Total answers: {len(answers)}")
print(f"Total existing sessions: {len(sessions)}")

# Get all unique session_ids from answers.json
answer_sessions = {}
for answer in answers:
    session_id = answer['session_id']
    if session_id not in answer_sessions:
        answer_sessions[session_id] = []
    answer_sessions[session_id].append(answer)

# Get all session_ids that already exist in sessions.json
existing_session_ids = set(s['session_id'] for s in sessions)

# Find session_ids that are in answers but not in sessions
missing_session_ids = [sid for sid in answer_sessions.keys() if sid not in existing_session_ids]

print(f"\nTotal unique sessions in answers: {len(answer_sessions)}")
print(f"Missing sessions: {len(missing_session_ids)}")

# Create new session records
new_sessions = []
next_id = max(s['id'] for s in sessions) + 1 if sessions else 1

for session_id in missing_session_ids:
    session_answers = answer_sessions[session_id]
    
    if not session_answers:
        continue
    
    # Sort answers by timestamp
    session_answers.sort(key=lambda x: x['answered_at'])
    
    # Get player email and timestamps
    player_email = session_answers[0]['player_email']
    start_time = session_answers[0]['answered_at']
    end_time = session_answers[-1]['answered_at']
    
    # Calculate if completed (5 questions answered)
    completed = 1 if len(session_answers) >= 5 else 0
    
    # Calculate score based on correct answers (each correct = 500 points)
    correct_answers = sum(1 for a in session_answers if a['is_correct'] == 1)
    final_score = correct_answers * 500
    
    # Create session record
    session_record = {
        "id": next_id,
        "session_id": session_id,
        "player_email": player_email,
        "start_time": start_time,
        "end_time": end_time if completed else None,
        "final_score": final_score,
        "fuel_remaining": 100 if completed else 0,
        "completed": completed,
        "ip_address": "::1",
        "user_agent": "Mozilla/5.0"
    }
    
    new_sessions.append(session_record)
    next_id += 1

# Combine all sessions and sort by start_time
all_sessions = new_sessions + sessions
all_sessions.sort(key=lambda x: datetime.fromisoformat(x['start_time'].replace('Z', '+00:00')))

# Reassign IDs in chronological order
for i, session in enumerate(all_sessions, start=1):
    session['id'] = i

# Create updated sessions object
updated_sessions = {
    "sessions": all_sessions
}

# Write to file
with open('sessions-updated.json', 'w', encoding='utf-8') as f:
    json.dump(updated_sessions, f, indent=2)

print(f"\nCreated {len(new_sessions)} new session records")
print(f"Total sessions in updated file: {len(all_sessions)}")
print("Updated sessions written to sessions-updated.json")

# Show a sample of the first few new sessions
if new_sessions:
    print("\nFirst 5 new sessions added:")
    for session in sorted(new_sessions, key=lambda x: x['start_time'])[:5]:
        print(f"  ID {session['id']}: {session['player_email']} at {session['start_time']} (Score: {session['final_score']}, Completed: {session['completed']})")
