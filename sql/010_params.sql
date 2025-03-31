/*
Parameters for the game
*/

CREATE TABLE game_parameters (
	team_id_chosen INTEGER,
	CONSTRAINT fk_param_team
		FOREIGN KEY (team_id_chosen)
		REFERENCES team (id)
);

--Set the current team to 24: Phoenix Suns
INSERT INTO game_parameters (team_id_chosen)
VALUES (24);

