DROP TABLE conference;

CREATE TABLE conference (
	id INTEGER,
	conference_name TEXT,
	CONSTRAINT pk_conf
	PRIMARY KEY (id)
);

INSERT INTO conference (id, conference_name) VALUES
(1, 'East'),
(2, 'West');


ALTER TABLE team
ADD COLUMN conference_id INTEGER;

ALTER TABLE team
ADD CONSTRAINT fk_team_conf
FOREIGN KEY (conference_id)
REFERENCES conference(id);

SELECT * FROM team;

UPDATE team
SET conference_id = 1
WHERE id IN (
	1, 2, 3, 4, 5, 6, 9, 12, 16, 17, 20, 22, 23, 28, 30
);

UPDATE team
SET conference_id = 2
WHERE id IN (
	7, 8, 10, 11, 13, 14, 15, 18, 19, 21, 24, 25, 26, 27, 29
);