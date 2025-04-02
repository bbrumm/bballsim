ALTER TABLE player_match_stats 
ADD COLUMN assists INTEGER;

ALTER TABLE player_match_stats 
ADD COLUMN steals INTEGER;

ALTER TABLE player_match_stats 
ADD COLUMN blocks INTEGER;

SELECT * FROM player_match_stats pms
ORDER BY id DESC;