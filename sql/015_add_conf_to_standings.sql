DROP VIEW standings;

CREATE VIEW standings AS
SELECT
s2.pos,
s2.id,
s2.team_name,
s2.team_rating,
s2.wins,
s2.losses,
s2.points_for,
s2.points_against,
s2.conference_id,
c.conference_name
FROM
(
	SELECT
	ROW_NUMBER() OVER(ORDER BY SUM(wins) DESC, SUM(losses) ASC, SUM(points_for) DESC, SUM(points_against)) AS pos,
	id,
	team_name,
	team_rating,
	conference_id,
	SUM(wins) AS wins,
	SUM(losses) AS losses,
	SUM(points_for) AS points_for,
	SUM(points_against) AS points_against
	FROM (
		SELECT
		t.id,
		t.team_name,
		t.team_rating,
		t.conference_id,
		COUNT(rw.id) AS wins,
		0 AS losses,
		SUM(rw.winning_team_score) AS points_for,
		SUM(rw.losing_team_score) AS points_against
		FROM team t
		LEFT JOIN match_result rw ON t.id = rw.winning_team_id
		GROUP BY t.id, t.team_name, t.team_rating, t.conference_id
		UNION ALL
		SELECT
		t.id,
		t.team_name,
		t.team_rating,
		t.conference_id,
		0 AS wins,
		COUNT(rl.id) AS losses,
		SUM(rl.losing_team_score) AS points_for,
		SUM(rl.winning_team_score) AS points_against
		FROM team t
		LEFT JOIN match_result rl ON t.id = rl.losing_team_id
		GROUP BY t.id, t.team_name, t.team_rating, t.conference_id
	) s
	GROUP BY id, team_name, team_rating, conference_id
) s2
INNER JOIN conference c ON s2.conference_id = c.id;