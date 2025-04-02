-- public.standings source
DROP VIEW standings;

CREATE VIEW standings
AS SELECT s2.pos,
	s2.pos_conference,
    s2.id,
    s2.team_name,
    s2.team_rating,
    s2.wins,
    s2.losses,
    s2.points_for,
    s2.points_against,
    s2.conference_id,
    c.conference_name
   FROM (
   SELECT
   row_number() OVER (
   	ORDER BY (sum(s.wins)) DESC, (sum(s.losses)), (sum(s.points_for)) DESC, (sum(s.points_against))
   ) AS pos,
   row_number() OVER (
     PARTITION BY s.conference_id
     ORDER BY (sum(s.wins)) DESC, (sum(s.losses)), (sum(s.points_for)) DESC, (sum(s.points_against))
    ) AS pos_conference,
            s.id,
            s.team_name,
            s.team_rating,
            s.conference_id,
            sum(s.wins) AS wins,
            sum(s.losses) AS losses,
            sum(s.points_for) AS points_for,
            sum(s.points_against) AS points_against
           FROM ( SELECT t.id,
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
                  GROUP BY t.id, t.team_name, t.team_rating, t.conference_id) s
          GROUP BY s.id, s.team_name, s.team_rating, s.conference_id) s2
     JOIN conference c ON s2.conference_id = c.id;