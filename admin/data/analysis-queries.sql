-- Database Analysis Queries for Yamaha Game SQLite Database
-- Run with: sqlite3 admin/data/yamaha.db < analysis-queries.sql

.echo on
.mode column
.headers on

-- ============================================
-- OVERVIEW STATISTICS
-- ============================================

SELECT '==========================================';
SELECT 'DATABASE OVERVIEW';
SELECT '==========================================';

SELECT 
    'Sessions' as Table_Name,
    COUNT(*) as Total_Records
FROM sessions
UNION ALL
SELECT 
    'Answers' as Table_Name,
    COUNT(*) as Total_Records
FROM answers
UNION ALL
SELECT 
    'Questions' as Table_Name,
    COUNT(*) as Total_Records
FROM questions;

SELECT '';

-- ============================================
-- SESSION COVERAGE
-- ============================================

SELECT '==========================================';
SELECT 'SESSION COVERAGE ANALYSIS';
SELECT '==========================================';

SELECT 
    COUNT(DISTINCT s.session_id) as Total_Sessions,
    COUNT(DISTINCT a.session_id) as Sessions_With_Answers,
    COUNT(DISTINCT s.session_id) - COUNT(DISTINCT a.session_id) as Sessions_Without_Answers,
    ROUND(CAST(COUNT(DISTINCT a.session_id) AS FLOAT) / CAST(COUNT(DISTINCT s.session_id) AS FLOAT) * 100, 2) as Coverage_Percentage
FROM sessions s
LEFT JOIN answers a ON s.session_id = a.session_id;

SELECT '';

-- ============================================
-- MISSING ANSWERS BY COMPLETION STATUS
-- ============================================

SELECT '==========================================';
SELECT 'SESSIONS WITHOUT ANSWERS (By Status)';
SELECT '==========================================';

SELECT 
    CASE 
        WHEN s.completed = 1 THEN 'Completed (DATA LOSS)'
        ELSE 'Incomplete (Expected)'
    END as Session_Type,
    COUNT(*) as Count,
    ROUND(AVG(s.final_score), 0) as Avg_Score,
    MIN(s.start_time) as Earliest_Session,
    MAX(s.start_time) as Latest_Session
FROM sessions s
LEFT JOIN answers a ON s.session_id = a.session_id
WHERE a.id IS NULL
GROUP BY s.completed;

SELECT '';

-- ============================================
-- TOP 20 COMPLETED SESSIONS WITH MISSING ANSWERS
-- ============================================

SELECT '==========================================';
SELECT 'TOP 20 COMPLETED SESSIONS WITH MISSING ANSWERS';
SELECT '==========================================';

SELECT 
    SUBSTR(s.session_id, 1, 16) || '...' as Session_ID,
    s.player_email as Email,
    s.final_score as Score,
    s.fuel_remaining as Fuel,
    SUBSTR(s.start_time, 1, 10) as Date
FROM sessions s
LEFT JOIN answers a ON s.session_id = a.session_id
WHERE a.id IS NULL AND s.completed = 1
ORDER BY s.final_score DESC
LIMIT 20;

SELECT '';

-- ============================================
-- SESSIONS WITH COMPLETE DATA (Sample)
-- ============================================

SELECT '==========================================';
SELECT 'TOP 10 SESSIONS WITH COMPLETE DATA';
SELECT '==========================================';

SELECT 
    SUBSTR(s.session_id, 1, 16) || '...' as Session_ID,
    s.player_email as Email,
    s.final_score as Score,
    COUNT(a.id) as Answers_Count,
    SUBSTR(s.start_time, 1, 10) as Date
FROM sessions s
INNER JOIN answers a ON s.session_id = a.session_id
GROUP BY s.session_id
ORDER BY s.final_score DESC
LIMIT 10;

SELECT '';

-- ============================================
-- DAILY SESSION SUMMARY
-- ============================================

SELECT '==========================================';
SELECT 'SESSIONS PER DAY';
SELECT '==========================================';

SELECT 
    DATE(start_time) as Date,
    COUNT(*) as Total_Sessions,
    SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as Completed,
    SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as Incomplete,
    ROUND(AVG(final_score), 0) as Avg_Score
FROM sessions
GROUP BY DATE(start_time)
ORDER BY Date DESC;

SELECT '';

-- ============================================
-- ANSWER ACCURACY BY QUESTION
-- ============================================

SELECT '==========================================';
SELECT 'TOP 10 MOST ANSWERED QUESTIONS';
SELECT '==========================================';

SELECT 
    q.id as Q_ID,
    SUBSTR(q.question, 1, 50) || '...' as Question,
    COUNT(a.id) as Times_Asked,
    SUM(CASE WHEN a.is_correct = 1 THEN 1 ELSE 0 END) as Correct,
    ROUND(CAST(SUM(CASE WHEN a.is_correct = 1 THEN 1 ELSE 0 END) AS FLOAT) / CAST(COUNT(a.id) AS FLOAT) * 100, 1) as Accuracy_Percent
FROM questions q
LEFT JOIN answers a ON q.id = a.question_id
WHERE q.active = 1
GROUP BY q.id
ORDER BY Times_Asked DESC
LIMIT 10;

SELECT '';

-- ============================================
-- PLAYERS WITH MOST SESSIONS
-- ============================================

SELECT '==========================================';
SELECT 'TOP 15 PLAYERS (By Sessions)';
SELECT '==========================================';

SELECT 
    player_email as Email,
    COUNT(*) as Total_Sessions,
    SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as Completed,
    MAX(final_score) as Best_Score,
    ROUND(AVG(final_score), 0) as Avg_Score
FROM sessions
WHERE player_email IS NOT NULL
GROUP BY player_email
ORDER BY Total_Sessions DESC
LIMIT 15;

SELECT '';

-- ============================================
-- SCORE DISTRIBUTION
-- ============================================

SELECT '==========================================';
SELECT 'SCORE DISTRIBUTION (Completed Sessions)';
SELECT '==========================================';

SELECT 
    CASE 
        WHEN final_score < 1000 THEN '0-999'
        WHEN final_score < 1500 THEN '1000-1499'
        WHEN final_score < 2000 THEN '1500-1999'
        WHEN final_score < 2500 THEN '2000-2499'
        ELSE '2500+'
    END as Score_Range,
    COUNT(*) as Sessions,
    ROUND(AVG(final_score), 0) as Avg_Score
FROM sessions
WHERE completed = 1
GROUP BY 
    CASE 
        WHEN final_score < 1000 THEN '0-999'
        WHEN final_score < 1500 THEN '1000-1499'
        WHEN final_score < 2000 THEN '1500-1999'
        WHEN final_score < 2500 THEN '2000-2499'
        ELSE '2500+'
    END
ORDER BY Score_Range;

SELECT '';

-- ============================================
-- RECENT ACTIVITY (Last 7 Days)
-- ============================================

SELECT '==========================================';
SELECT 'RECENT ACTIVITY (Last 20 Sessions)';
SELECT '==========================================';

SELECT 
    SUBSTR(session_id, 1, 12) || '...' as Session,
    player_email as Email,
    final_score as Score,
    CASE WHEN completed = 1 THEN 'Yes' ELSE 'No' END as Done,
    SUBSTR(start_time, 1, 19) as Started
FROM sessions
ORDER BY start_time DESC
LIMIT 20;

SELECT '';
SELECT '==========================================';
SELECT 'Analysis Complete!';
SELECT '==========================================';
