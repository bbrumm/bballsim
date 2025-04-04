SELECT t.team_name, t.team_rating, c.conference_name, t.image_filename
FROM team t 
INNER JOIN conference c ON t.conference_id = c.id
WHERE t.id = $1;