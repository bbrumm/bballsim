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
r.losing_team_score AS points_against
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
r.winning_team_score AS points_against
FROM team t
LEFT JOIN match_result r ON t.id = r.losing_team_id
LEFT JOIN team o ON r.winning_team_id = o.id
WHERE t.id = 28
ORDER BY id ASC;