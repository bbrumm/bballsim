const db = require('./db.js');

const client = db.client;

module.exports.showTeamPage = showTeamPage;


async function showTeamPage(req, res) {
    console.log('Request Query: ', req.query);

    teamDetails = await lookupTeamDetails(req.query.teamID);
    teamMatchResults = await lookupMatchResultsForTeam(req.query.teamID);
    playerDetails = await lookupPlayerDetailsForTeam(req.query.teamID)

    res.render('team', {
        teamDetails: teamDetails,
        teamID: req.query.teamID,
        teamMatchResults: teamMatchResults
    });
}


async function lookupTeamDetails(teamID) {
    queryString = 'SELECT team_name, team_rating FROM team WHERE id = $1';
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
        'p.rating_ovr ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'WHERE t.id = $1 ' +
        'ORDER BY p.rating_ovr DESC;';
    try {
        const res = await client.query(queryString, [teamID]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}