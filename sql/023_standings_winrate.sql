-- public.standings source
DROP VIEW standings;

CREATE VIEW standings
AS SELECT
s2.pos,
s2.pos_conference,
s2.id,
s2.team_name,
s2.team_rating,
s2.wins,
s2.losses,
s2.win_rate,
s2.points_for,
s2.points_against,
s2.conference_id,
c.conference_name
FROM (
	SELECT
	s3.id,
	s3.team_name,
	s3.team_rating,
	s3.conference_id,
	s3.wins,
	s3.losses,
	s3.win_rate,
	s3.points_for,
	s3.points_against,
    ROW_NUMBER() OVER (
   		ORDER BY s3.win_rate DESC, s3.losses ASC, s3.points_for DESC, s3.points_against ASC
   	) AS pos,
   	ROW_NUMBER() OVER (
    	PARTITION BY s3.conference_id
    	ORDER BY s3.win_rate DESC, s3.losses ASC, s3.points_for DESC, s3.points_against ASC
    ) AS pos_conference 
	FROM (
		SELECT
	    s.id,
	    s.team_name,
	    s.team_rating,
	    s.conference_id,
	    sum(s.wins) AS wins,
	    sum(s.losses) AS losses,
	    ROUND(SUM(s.wins) / (SUM(s.wins) + SUM(s.losses)), 3) AS win_rate,
	    sum(s.points_for) AS points_for,
	    sum(s.points_against) AS points_against
	    FROM (
	    	SELECT t.id,
	        t.team_name,
	        t.team_rating,
	        t.conference_id,
	        count(rw.id) AS wins,
	        0 AS losses,
	        sum(rw.winning_team_score) AS points_for,
	        sum(rw.losing_team_score) AS points_against
	        FROM team t
	        LEFT JOIN match_result rw ON t.id = rw.winning_team_id
	        GROUP BY t.id, t.team_name, t.team_rating, t.conference_id
	        UNION ALL
		    SELECT t.id,
	        t.team_name,
	        t.team_rating,
	        t.conference_id,
	        0 AS wins,
	        count(rl.id) AS losses,
	        sum(rl.losing_team_score) AS points_for,
	        sum(rl.winning_team_score) AS points_against
	        FROM team t
		    LEFT JOIN match_result rl ON t.id = rl.losing_team_id
		    GROUP BY t.id, t.team_name, t.team_rating, t.conference_id
		) s
	    GROUP BY s.id, s.team_name, s.team_rating, s.conference_id
	 ) s3
) s2
INNER JOIN conference c ON s2.conference_id = c.id;

