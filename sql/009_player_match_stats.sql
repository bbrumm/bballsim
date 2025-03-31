ALTER TABLE match_result
ADD CONSTRAINT pk_matchresult PRIMARY KEY (id);

CREATE TABLE player_match_stats (
	id SERIAL,
	match_result_id INTEGER,
	player_id INTEGER,
	points_scored INTEGER,
	CONSTRAINT pk_pms PRIMARY KEY (id),
	CONSTRAINT fk_pms_matchresult
		FOREIGN KEY (match_result_id)
		REFERENCES match_result (id),
	CONSTRAINT fk_pms_player
		FOREIGN KEY (player_id)
		REFERENCES player (id)
);