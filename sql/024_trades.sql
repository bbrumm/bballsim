CREATE TABLE complete_trade (
	id SERIAL,
	create_datetime TIMESTAMP,
	player_id INTEGER,
	old_team_id INTEGER,
	new_team_id INTEGER,
	CONSTRAINT pk_cmptrade PRIMARY KEY (id),
	CONSTRAINT fk_cmptrade_ply
		FOREIGN KEY (player_id)
		REFERENCES player (id),
	CONSTRAINT fk_cmptrade_oldteam
		FOREIGN KEY (old_team_id)
		REFERENCES team (id),
	CONSTRAINT fk_cmptrade_newteam
		FOREIGN KEY (new_team_id)
		REFERENCES team (id)
);