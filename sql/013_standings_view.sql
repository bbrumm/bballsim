CREATE VIEW standings AS
SELECT
pos,
id,
team_name,
wins,
losses,
points_for,
points_against
FROM
(
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
) s2;


--Select from the view
SELECT
pos,
id,
team_name,
wins,
losses,
points_for,
points_against
FROM standings
ORDER BY wins DESC, losses ASC, points_for DESC, points_against ASC;