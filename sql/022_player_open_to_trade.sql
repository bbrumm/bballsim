ALTER TABLE player
ADD COLUMN open_to_trade BOOLEAN;

--Set the default value to FALSE for all players
UPDATE player
SET open_to_trade = FALSE;

--Update the value to TRUE for a few players
UPDATE player
SET open_to_trade = TRUE
WHERE id IN (
	SELECT id
	FROM player
	ORDER BY RANDOM()
	LIMIT 15
);

