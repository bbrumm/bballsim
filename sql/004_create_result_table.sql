DROP TABLE match_result;

ALTER TABLE team ADD CONSTRAINT pk_team PRIMARY KEY (id);

CREATE TABLE match_result (
	id SERIAL,
	winning_team_id INTEGER,
	losing_team_id INTEGER,
	CONSTRAINT fk_mr_winteam
	  FOREIGN KEY (winning_team_id)
	  REFERENCES team (id),
	CONSTRAINT fk_mr_loseteam
	  FOREIGN KEY (losing_team_id)
	  REFERENCES team (id)
);

