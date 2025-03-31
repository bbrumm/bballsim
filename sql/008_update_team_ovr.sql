ALTER TABLE team
ADD COLUMN old_team_rating INTEGER;

UPDATE team SET old_team_rating = team_rating;

--Update new values based on the average of the top 8 players

UPDATE team AS mt
SET team_rating = r.new_team_rating
FROM (
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
	GROUP BY team_id
) AS r
WHERE mt.id = r.team_id;


