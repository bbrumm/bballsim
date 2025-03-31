const db = require('./db.js');
const client = db.client;

module.exports.lookupTeamDetails = lookupTeamDetails;
module.exports.lookupMatchResultsForTeam = lookupMatchResultsForTeam;
module.exports.lookupPlayerDetailsForTeam = lookupPlayerDetailsForTeam;
module.exports.lookupChosenTeamID = lookupChosenTeamID;
module.exports.lookupOverallRecordForTeam = lookupOverallRecordForTeam;
module.exports.lookupNextMatchForTeam = lookupNextMatchForTeam;



async function lookupTeamDetails(teamID) {
    queryString = 'SELECT t.team_name, t.team_rating, c.conference_name ' +
    'FROM team t ' +
    'INNER JOIN conference c ON t.conference_id = c.id ' +
    'WHERE t.id = $1';
    try {
        const res = await client.query(queryString, [teamID]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}



async function lookupMatchResultsForTeam(teamID) {
    queryString = 'SELECT ' +
        'r.id, ' +
        'r.winning_team_id AS team_id, ' +
        'r.losing_team_id AS opponent_team_id, ' +
        'o.team_name AS opponent, ' +
        'r.winning_team_score AS points_for, ' +
        'r.losing_team_score AS points_against, ' +
        '\'Won\' AS match_result ' +
        'FROM team t ' +
        'LEFT JOIN match_result r ON t.id = r.winning_team_id ' +
        'LEFT JOIN team o ON r.losing_team_id = o.id ' +
        'WHERE t.id = $1 ' +
        'UNION ALL ' +
        'SELECT ' +
        'r.id, ' +
        'r.losing_team_id AS team_id, ' +
        'r.winning_team_id AS opponent_team_id, ' +
        'o.team_name AS opponent, ' +
        'r.losing_team_score AS points_for, ' +
        'r.winning_team_score AS points_against, ' +
        '\'Lost\' ' +
        'FROM team t ' +
        'LEFT JOIN match_result r ON t.id = r.losing_team_id ' +
        'LEFT JOIN team o ON r.winning_team_id = o.id ' +
        'WHERE t.id = $1 ' +
        'ORDER BY id ASC;';
    try {
        const res = await client.query(queryString, [teamID]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function lookupPlayerDetailsForTeam(teamID) {
    queryString = 'SELECT ' +
        'p.id, ' +
        'p.first_name, ' +
        'p.last_name, ' +
        'p.rating_ovr, ' +
        'SUM(s.points_scored) AS points_scored ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'LEFT JOIN player_match_stats s ON p.id = s.player_id ' +
        'WHERE t.id = $1 ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr ' +
        'ORDER BY p.rating_ovr DESC;';
    try {
        const res = await client.query(queryString, [teamID]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function lookupChosenTeamID() {
    queryString = 'SELECT team_id_chosen FROM game_parameters;';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function lookupOverallRecordForTeam(teamID) {
    queryString = queryString = 'SELECT ' +
    'pos, ' +
    'id, ' +
    'team_name, ' +
    'team_rating, ' +
    'wins, ' +
    'losses, ' +
    'points_for, ' +
    'points_against ' +
    'FROM standings ' +
    'WHERE id = $1 ' +
    'ORDER BY wins DESC, losses ASC, points_for DESC, points_against ASC;';
    try {
        const res = await client.query(queryString, [teamID]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function lookupNextMatchForTeam(teamID) {
    queryString = queryString = 'SELECT ' + 
        'mr.id AS match_result_id, ' +
        'mr.team1_id, ' +
        't1.team_name AS team1_name, ' +
        'mr.team2_id, ' +
        't2.team_name AS team2_name ' +
        'FROM match_result mr ' +
        'INNER JOIN team t1 ON mr.team1_id = t1.id ' +
        'INNER JOIN team t2 ON mr.team2_id = t2.id ' +
        'WHERE mr.id = ( ' +
            'SELECT MIN(id) ' +
            'FROM match_result ' +
            'WHERE winning_team_id IS NULL ' +
            'AND (team1_id = $1 OR team2_id = $1) ' +
        ');';
    try {
        const res = await client.query(queryString, [teamID]);
        console.log('Next match: ', res.rows);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}