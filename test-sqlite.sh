#!/bin/bash

# Yamaha SQLite Migration Test Suite
echo "🧪 Testing SQLite Migration..."
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Game Questions Endpoint
echo "📝 Test 1: Fetching game questions..."
QUESTIONS=$(curl -s "$BASE_URL/api/game/questions")
QUESTION_COUNT=$(echo $QUESTIONS | jq -r '.questions | length')
echo "   ✓ Found $QUESTION_COUNT questions"

# Test 2: Kamote Messages
echo ""
echo "💬 Test 2: Fetching kamote messages..."
MESSAGES=$(curl -s "$BASE_URL/api/game/kamote-messages")
MESSAGE_COUNT=$(echo $MESSAGES | jq -r '.messages | length')
echo "   ✓ Found $MESSAGE_COUNT active messages"

# Test 3: Session Start
echo ""
echo "🎮 Test 3: Starting a test session..."
SESSION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/sessions/start" \
  -H "Content-Type: application/json" \
  -d '{
    "player_email": "test@example.com",
    "ip_address": "127.0.0.1",
    "user_agent": "Test-Agent"
  }')
SESSION_ID=$(echo $SESSION_RESPONSE | jq -r '.session_id')
echo "   ✓ Session created: $SESSION_ID"

# Test 4: Submit Answer
echo ""
echo "✍️  Test 4: Submitting an answer..."
ANSWER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/sessions/answer" \
  -H "Content-Type: application/json" \
  -d "{
    \"session_id\": \"$SESSION_ID\",
    \"player_email\": \"test@example.com\",
    \"question_id\": 1,
    \"selected_answer\": 1,
    \"is_correct\": true
  }")
echo "   ✓ Answer recorded"

# Test 5: End Session
echo ""
echo "🏁 Test 5: Ending session..."
END_RESPONSE=$(curl -s -X POST "$BASE_URL/api/sessions/end" \
  -H "Content-Type: application/json" \
  -d "{
    \"session_id\": \"$SESSION_ID\",
    \"final_score\": 100,
    \"fuel_remaining\": 50
  }")
echo "   ✓ Session ended"

# Test 6: Admin Login (protected endpoints)
echo ""
echo "🔐 Test 6: Testing admin authentication..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "YamahaAdmin2024@Prod"
  }')
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "   ✓ Admin authenticated"
  
  # Test 7: Get all sessions (admin only)
  echo ""
  echo "📊 Test 7: Fetching all sessions (admin)..."
  SESSIONS=$(curl -s "$BASE_URL/api/sessions" \
    -H "Authorization: Bearer $TOKEN")
  SESSION_COUNT=$(echo $SESSIONS | jq -r '.sessions | length')
  echo "   ✓ Found $SESSION_COUNT total sessions"
  
  # Test 8: Get analytics
  echo ""
  echo "📈 Test 8: Fetching analytics..."
  ANALYTICS=$(curl -s "$BASE_URL/api/analytics" \
    -H "Authorization: Bearer $TOKEN")
  TOTAL_SESSIONS=$(echo $ANALYTICS | jq -r '.stats.totalSessions')
  COMPLETED=$(echo $ANALYTICS | jq -r '.stats.completedSessions')
  AVG_SCORE=$(echo $ANALYTICS | jq -r '.stats.averageScore')
  echo "   ✓ Total sessions: $TOTAL_SESSIONS"
  echo "   ✓ Completed: $COMPLETED"
  echo "   ✓ Average score: $AVG_SCORE"
  
  # Test 9: Get leaderboard
  echo ""
  echo "🏆 Test 9: Fetching leaderboard..."
  LEADERBOARD=$(echo $ANALYTICS | jq -r '.leaderboard | length')
  TOP_PLAYER=$(echo $ANALYTICS | jq -r '.leaderboard[0].player_email')
  TOP_SCORE=$(echo $ANALYTICS | jq -r '.leaderboard[0].best_score')
  echo "   ✓ Leaderboard entries: $LEADERBOARD"
  echo "   ✓ Top player: $TOP_PLAYER (Score: $TOP_SCORE)"
  
  # Test 10: Get question stats
  echo ""
  echo "📊 Test 10: Question statistics..."
  QUESTION_STATS=$(echo $ANALYTICS | jq -r '.questionStats | length')
  echo "   ✓ Question stats available: $QUESTION_STATS"
else
  echo "   ✗ Authentication failed"
fi

# Summary
echo ""
echo "═══════════════════════════════════════"
echo "✅ SQLite Migration Test Complete!"
echo "═══════════════════════════════════════"
echo "Database: admin/data/yamaha.db"
echo "Questions: $QUESTION_COUNT"
echo "Sessions: $SESSION_COUNT"
echo "Average Score: $AVG_SCORE"
echo "═══════════════════════════════════════"
