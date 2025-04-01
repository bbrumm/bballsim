SELECT id, team_name FROM team;

SELECT id, team_name FROM team ORDER BY RANDOM() LIMIT 2;

SELECT * FROM match_result;

/*
Query for match standings
*/

SELECT
t.id,
t.team_name,
(SELECT COUNT(*) FROM match_result WHERE winning_team_id = t.id) AS wins,
(SELECT COUNT(*) FROM match_result WHERE losing_team_id = t.id) AS losses,
FROM team t
ORDER BY wins DESC, losses DESC;

/*
Try a subquery
*/

SELECT
winning_team_id,
losing_team_id,
winning_team_score,
losing_team_score
FROM match_result;

SELECT
t.id,
t.team_name,
rw.winning_team_score,
rl.losing_team_score
FROM team t
LEFT JOIN match_result rw ON t.id = rw.winning_team_id
LEFT JOIN match_result rl ON t.id = rl.losing_team_id;


SELECT
t.id,
t.team_name,
COUNT(rw.id) AS wins,
SUM(rw.winning_team_score) AS points_for,
SUM(rw.losing_team_score) AS points_against
FROM team t
LEFT JOIN match_result rw ON t.id = rw.winning_team_id
GROUP BY t.id, t.team_name;


--Add losing matches


SELECT
t.id,
t.team_name,
COUNT(rw.id) AS wins,
0 AS losses,
SUM(rw.winning_team_score) AS points_for,
SUM(rw.losing_team_score) AS points_against
FROM team t
LEFT JOIN match_result rw ON t.id = rw.winning_team_id
GROUP BY t.id, t.team_name
UNION ALL
SELECT
t.id,
t.team_name,
0 AS wins,
COUNT(rl.id) AS losses,
SUM(rl.losing_team_score) AS points_for,
SUM(rl.winning_team_score) AS points_against
FROM team t
LEFT JOIN match_result rl ON t.id = rl.losing_team_id
GROUP BY t.id, t.team_name;

--Aggregate


SELECT
ROW_NUMBER() OVER(ORDER BY SUM(wins) DESC, SUM(losses) ASC, SUM(points_for) DESC, SUM(points_against)) AS pos,
id,
team_name,
SUM(wins) AS wins,
SUM(losses) AS losses,
SUM(points_for) AS points_for,
SUM(points_against) AS points_against
FROM (
	SELECT
	t.id,
	t.team_name,
	COUNT(rw.id) AS wins,
	0 AS losses,
	SUM(rw.winning_team_score) AS points_for,
	SUM(rw.losing_team_score) AS points_against
	FROM team t
	LEFT JOIN match_result rw ON t.id = rw.winning_team_id
	GROUP BY t.id, t.team_name
	UNION ALL
	SELECT
	t.id,
	t.team_name,
	0 AS wins,
	COUNT(rl.id) AS losses,
	SUM(rl.losing_team_score) AS points_for,
	SUM(rl.winning_team_score) AS points_against
	FROM team t
	LEFT JOIN match_result rl ON t.id = rl.losing_team_id
	GROUP BY t.id, t.team_name
) s
GROUP BY id, team_name
ORDER BY SUM(wins) DESC, SUM(losses) ASC, SUM(points_for) DESC, SUM(points_against) ASC;



----
SELECT * FROM team;

/*
Find the results for a team
*/

SELECT
r.id,
r.winning_team_id AS team_id,
r.losing_team_id AS opponent_team_id,
o.team_name AS opponent,
r.winning_team_score AS points_for,
r.losing_team_score AS points_against,
'Won' AS match_result
FROM team t
LEFT JOIN match_result r ON t.id = r.winning_team_id
LEFT JOIN team o ON r.losing_team_id = o.id
WHERE t.id = 28
UNION ALL
SELECT
r.id,
r.losing_team_id AS team_id,
r.winning_team_id AS opponent_team_id,
o.team_name AS opponent,
r.losing_team_score AS points_for,
r.winning_team_score AS points_against,
'Lost'
FROM team t
LEFT JOIN match_result r ON t.id = r.losing_team_id
LEFT JOIN team o ON r.winning_team_id = o.id
WHERE t.id = 28
ORDER BY id ASC;

/*
Find the players for a team
*/



SELECT
p.id,
p.first_name,
p.last_name,
p.rating_ovr
FROM player p
INNER JOIN team t ON p.team_id = t.id
WHERE t.id = 28
ORDER BY p.rating_ovr DESC;

/*
Calculate the new overall rating
Average of the top 8 player individual OVR ratings
*/

SELECT
t.id AS team_id,
p.id AS player_id,
p.rating_ovr,
ROW_NUMBER() OVER (
	PARTITION BY t.id
	ORDER BY p.rating_ovr DESC
) AS player_order
FROM player p
INNER JOIN team t ON p.team_id = t.id
ORDER BY t.id ASC, p.rating_ovr DESC; 



SELECT
team_id,
player_id,
rating_ovr
FROM (
	SELECT
	t.id AS team_id,
	p.id AS player_id,
	p.rating_ovr,
	ROW_NUMBER() OVER (
		PARTITION BY t.id
		ORDER BY p.rating_ovr DESC
	) AS player_order
	FROM player p
	INNER JOIN team t ON p.team_id = t.id
	ORDER BY t.id ASC, p.rating_ovr DESC
) s
WHERE s.player_order <= 8;



/*
 * 
 * Find the average rating of the top 8 players for each team
 * This is the source of the new team ratings
 */
SELECT
team_id,
ROUND(AVG(rating_ovr), 0) AS new_team_rating
FROM (
	SELECT
	t.id AS team_id,
	p.id AS player_id,
	p.rating_ovr,
	ROW_NUMBER() OVER (
		PARTITION BY t.id
		ORDER BY p.rating_ovr DESC
	) AS player_order
	FROM player p
	INNER JOIN team t ON p.team_id = t.id
	ORDER BY t.id ASC, p.rating_ovr DESC
) s
WHERE s.player_order <= 8
GROUP BY team_id;




SELECT * FROM player_match_stats;

SELECT MAX(id) AS max_id FROM match_result;


SELECT 
p.id, 
p.first_name, 
p.last_name, 
p.rating_ovr,
SUM(s.points_scored) AS points_scored
FROM player p 
INNER JOIN team t ON p.team_id = t.id 
LEFT JOIN player_match_stats s ON p.id = s.player_id
WHERE t.id = 1
GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr
ORDER BY p.rating_ovr DESC;




SELECT 
p.id, 
p.first_name, 
p.last_name, 
p.rating_ovr,
SUM(s.points_scored) AS points_scored,
COUNT(DISTINCT s.id) AS games_played
FROM player p 
INNER JOIN team t ON p.team_id = t.id 
LEFT JOIN player_match_stats s ON p.id = s.player_id
WHERE t.id = 21
GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr
ORDER BY p.rating_ovr DESC;



SELECT 
p.id, 
p.first_name, 
p.last_name, 
t.id AS team_id, 
t.team_name, 
p.rating_ovr, 
SUM(s.points_scored) AS points_scored, 
COUNT(DISTINCT s.id) AS games_played, 
ROUND(SUM(s.points_scored) / COUNT(DISTINCT s.id), 1) AS ppg 
FROM player p 
INNER JOIN team t ON p.team_id = t.id 
INNER JOIN player_match_stats s ON p.id = s.player_id 
GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id 
ORDER BY SUM(s.points_scored) DESC;


/*
Generate a fixture of all teams
*/

SELECT
t1.id AS team_1_id,
t1.team_name AS team_1_name,
t2.id AS team_2_id,
t2.team_name AS team_2_name
FROM team t1
CROSS JOIN team t2
WHERE t1.id != t2.id;

/*
Find the next match
*/

SELECT *
FROM match_result mr;



SELECT
id AS match_result_id,
team1_id,
team2_id
FROM match_result mr
WHERE id = (
	SELECT MIN(id)
	FROM match_result
	WHERE winning_team_id IS NULL
);

/*
 * Find the next match for a specific team
 */


SELECT
mr.id AS match_result_id,
mr.team1_id,
t1.team_name,
mr.team2_id,
t2.team_name
FROM match_result mr
INNER JOIN team t1 ON mr.team1_id = t1.id
INNER JOIN team t2 ON mr.team2_id = t2.id
WHERE mr.id = (
	SELECT MIN(id)
	FROM match_result
	WHERE winning_team_id IS NULL
	AND (team1_id = 24 OR team2_id = 24)
);



SELECT
p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name
FROM player p
INNER JOIN team t ON p.team_id = t.id
ORDER BY rating_ovr ASC;
