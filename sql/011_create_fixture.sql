SELECT * FROM match_result;

ALTER TABLE match_result
ADD COLUMN team1_id INTEGER;

ALTER TABLE match_result
ADD COLUMN team2_id INTEGER;

ALTER TABLE match_result
ADD CONSTRAINT fk_matchresult_team1
FOREIGN KEY (team1_id)
REFERENCES team (id);

ALTER TABLE match_result
ADD CONSTRAINT fk_matchresult_team2
FOREIGN KEY (team2_id)
REFERENCES team (id);
