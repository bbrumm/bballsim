ALTER TABLE player_match_stats 
ADD COLUMN rebounds INTEGER;

SELECT * FROM player_match_stats pms
ORDER BY id DESC;