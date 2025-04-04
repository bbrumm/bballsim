ALTER TABLE game_parameters 
ADD playoff_mode INTEGER;

UPDATE game_parameters 
SET playoff_mode = 0;

CREATE TABLE match_type (
	id INTEGER,
	description TEXT,
	CONSTRAINT pk_matchtype PRIMARY KEY (id)
);

ALTER TABLE match_result
ADD COLUMN match_type_id INTEGER;

ALTER TABLE match_result 
ADD CONSTRAINT fk_mr_mtype
FOREIGN KEY (match_type_id)
REFERENCES match_type(id);

INSERT INTO match_type (id, description) VALUES
(1, 'Regular'),
(2, 'Playoffs');

UPDATE match_result 
SET match_type_id = 1;

CREATE TABLE playoff_series (
	id INTEGER,
	short_name VARCHAR(2),
	CONSTRAINT pk_plseries PRIMARY KEY (id)
);

INSERT INTO playoff_series (id, short_name) VALUES
(1, 'E1'),
(2, 'E2'),
(3, 'E3'),
(4, 'E4'),
(5, 'E5'),
(6, 'E6'),
(7, 'E7'),
(8, 'W1'),
(9, 'W2'),
(10, 'W3'),
(11, 'W4'),
(12, 'W5'),
(13, 'W6'),
(14, 'W7'),
(15, 'F');



ALTER TABLE match_result
ADD COLUMN playoff_series_id INTEGER;

ALTER TABLE match_result 
ADD CONSTRAINT fk_mr_plseries
FOREIGN KEY (playoff_series_id)
REFERENCES playoff_series(id);
