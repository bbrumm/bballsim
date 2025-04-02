const db = require('./db.js');
const client = db.client;

module.exports.lookupTeamDetails = lookupTeamDetails;
module.exports.lookupMatchResultsForTeam = lookupMatchResultsForTeam;
module.exports.lookupPlayerDetailsForTeam = lookupPlayerDetailsForTeam;
module.exports.lookupChosenTeamID = lookupChosenTeamID;
module.exports.lookupOverallRecordForTeam = lookupOverallRecordForTeam;
module.exports.lookupNextMatchForTeam = lookupNextMatchForTeam;
module.exports.lookupPlayerStatsPoints = lookupPlayerStatsPoints;
module.exports.lookupPlayerStatsRebounds = lookupPlayerStatsRebounds;
module.exports.lookupPlayerStatsAssists = lookupPlayerStatsAssists;
module.exports.lookupPlayerStatsSteals = lookupPlayerStatsSteals;
module.exports.lookupPlayerStatsBlocks = lookupPlayerStatsBlocks;
module.exports.lookupSinglePlayerStats = lookupSinglePlayerStats;
module.exports.getMatchHistory = getMatchHistory;
module.exports.lookupStandings = lookupStandings;
module.exports.lookupNextMatch = lookupNextMatch;
module.exports.lookupTeamFinances = lookupTeamFinances;
module.exports.lookupTotalTeamSalary = lookupTotalTeamSalary;
module.exports.lookupNumberOfRemainingMatchesForTeam = lookupNumberOfRemainingMatchesForTeam;



async function lookupTeamDetails(teamID) {
    queryString = 'SELECT t.team_name, t.team_rating, c.conference_name, t.image_filename ' +
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
        'p.annual_salary, ' +
        'SUM(s.points_scored) AS points_scored, ' +
        'SUM(COALESCE(s.rebounds, 0)) AS rebounds, ' +
        'SUM(COALESCE(s.assists, 0)) AS assists, ' +
        'SUM(COALESCE(s.steals, 0)) AS steals, ' +
        'SUM(COALESCE(s.blocks, 0)) AS blocks ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'LEFT JOIN player_match_stats s ON p.id = s.player_id ' +
        'WHERE t.id = $1 ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, p.annual_salary ' +
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

/*
async function lookupPlayerDetails(playerID) {
    queryString = queryString = 'SELECT ' +
        'p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'WHERE p.id = $1;';
    try {
        const res = await client.query(queryString, [playerID]);
        console.log('Player Details Results: ', res.rows);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}
*/


async function lookupPlayerStatsPoints() {
    queryString = 'SELECT ' +
        'p.id, ' +
        'p.first_name, ' +
        'p.last_name, ' +
        't.id AS team_id, ' +
        't.team_name, ' +
        'p.rating_ovr, ' +
        'SUM(s.points_scored) AS points_scored, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.points_scored) / COUNT(DISTINCT s.id), 1) AS ppg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_match_stats s ON p.id = s.player_id ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id ' +
        'ORDER BY SUM(s.points_scored) DESC LIMIT 20;';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}


async function lookupPlayerStatsRebounds() {
    queryString = 'SELECT ' +
        'p.id, ' +
        'p.first_name, ' +
        'p.last_name, ' +
        't.id AS team_id, ' +
        't.team_name, ' +
        'p.rating_ovr, ' +
        'SUM(s.rebounds) AS rebounds, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.rebounds) / COUNT(DISTINCT s.id), 1) AS rpg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_match_stats s ON p.id = s.player_id ' +
        'WHERE s.rebounds IS NOT NULL ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id ' +
        'ORDER BY SUM(s.rebounds) DESC LIMIT 20;';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}


async function lookupPlayerStatsAssists() {
    queryString = 'SELECT ' +
        'p.id, ' +
        'p.first_name, ' +
        'p.last_name, ' +
        't.id AS team_id, ' +
        't.team_name, ' +
        'p.rating_ovr, ' +
        'SUM(s.assists) AS assists, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.assists) / COUNT(DISTINCT s.id), 1) AS apg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_match_stats s ON p.id = s.player_id ' +
        'WHERE s.assists IS NOT NULL ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id ' +
        'ORDER BY SUM(s.assists) DESC LIMIT 20;';
    try {
        const res = await client.query(queryString);
        console.log('Assists Query: ' + queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function lookupPlayerStatsSteals() {
    queryString = 'SELECT ' +
        'p.id, ' +
        'p.first_name, ' +
        'p.last_name, ' +
        't.id AS team_id, ' +
        't.team_name, ' +
        'p.rating_ovr, ' +
        'SUM(s.steals) AS steals, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.steals) / COUNT(DISTINCT s.id), 1) AS spg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_match_stats s ON p.id = s.player_id ' +
        'WHERE s.steals IS NOT NULL ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id ' +
        'ORDER BY SUM(s.steals) DESC LIMIT 20;';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function lookupPlayerStatsBlocks() {
    queryString = 'SELECT ' +
        'p.id, ' +
        'p.first_name, ' +
        'p.last_name, ' +
        't.id AS team_id, ' +
        't.team_name, ' +
        'p.rating_ovr, ' +
        'SUM(s.blocks) AS blocks, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.blocks) / COUNT(DISTINCT s.id), 1) AS bpg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_match_stats s ON p.id = s.player_id ' +
        'WHERE s.blocks IS NOT NULL ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id ' +
        'ORDER BY SUM(s.blocks) DESC LIMIT 20;';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function lookupSinglePlayerStats(playerID) {
    queryString = 'SELECT ' +
        'p.id, ' +
        'p.first_name, ' +
        'p.last_name, ' +
        't.id AS team_id, ' +
        't.team_name, ' +
        'p.rating_ovr, ' +
        'SUM(s.points_scored) AS points_scored, ' +
        'SUM(s.rebounds) AS rebounds, ' +
        'SUM(s.assists) AS assists, ' +
        'SUM(s.steals) AS steals, ' +
        'SUM(s.blocks) AS blocks, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.points_scored) / COUNT(DISTINCT s.id), 1) AS ppg, ' +
        'ROUND(SUM(s.rebounds) / COUNT(DISTINCT s.id), 1) AS rpg, ' +
        'ROUND(SUM(s.assists) / COUNT(DISTINCT s.id), 1) AS apg, ' +
        'ROUND(SUM(s.steals) / COUNT(DISTINCT s.id), 1) AS spg, ' +
        'ROUND(SUM(s.blocks) / COUNT(DISTINCT s.id), 1) AS bpg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_match_stats s ON p.id = s.player_id ' +
        'WHERE p.id = $1 ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id';
    try {
        const res = await client.query(queryString, [playerID]);
        console.log('Player Details Results: ', res.rows);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function getMatchHistory() {
    queryString = 'SELECT ' +
        'mr.id, ' +
        'mr.winning_team_id, ' +
        'tw.team_name AS winning_team_name, ' +
        'mr.losing_team_id, ' +
        'tl.team_name AS losing_team_name, ' +
        'mr.winning_team_score, ' +
        'mr.losing_team_score ' +
        'FROM match_result mr ' +
        'INNER JOIN team tw ON mr.winning_team_id = tw.id  ' +
        'INNER JOIN team tl ON mr.losing_team_id = tl.id ' +
        'ORDER BY mr.id DESC; ';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}



async function lookupStandings(conference_id) {
    queryString = "SELECT " +
        "pos_conference, " +
        "id, " +
        "team_name, " +
        "team_rating, " +
        "wins, " +
        "losses, " +
        "points_for, " +
        "points_against, " +
        "conference_name, " +
        "'(' || pos_conference || ') ' || team_name || ' (' || wins || '-' || losses || ')' AS playoff_team_label " +
        "FROM standings " +
        "WHERE conference_id = $1 " +
        "ORDER BY wins DESC, losses ASC, points_for DESC, points_against ASC;";
    try {
        const res = await client.query(queryString, [conference_id]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function lookupNextMatch() {
    queryString = 'SELECT ' +
        'mr.id AS match_result_id, ' +
        'mr.team1_id, ' +
        't1.team_name AS team1_name, ' +
        't1.team_rating AS team1_rating, ' +
        't1.image_filename AS team1_image_filename, ' +
        'team2_id,' +
        't2.team_name AS team2_name, ' +
        't2.team_rating AS team2_rating, ' +
        't2.image_filename AS team2_image_filename ' +
        'FROM match_result mr ' +
        'INNER JOIN team t1 ON mr.team1_id = t1.id ' +
        'INNER JOIN team t2 ON mr.team2_id = t2.id ' +
        '    WHERE mr.id = ( ' +
        '    SELECT MIN(id) ' +
        '    FROM match_result ' +
        '    WHERE winning_team_id IS NULL ' +
        ');';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}


async function lookupTeamFinances() {
    queryString = 'SELECT team_bank_balance, income_per_game ' +
        'FROM game_parameters;';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function lookupTotalTeamSalary(teamID) {
    queryString = 'SELECT SUM(annual_salary) AS total_salary ' +
        'FROM player ' +
        'WHERE team_id = $1';
    try {
        const res = await client.query(queryString, [teamID]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function lookupNumberOfRemainingMatchesForTeam(teamID) {
    queryString = 'SELECT COUNT(*) AS match_count ' +
        'FROM match_result mr ' +
        'WHERE (team1_id = $1 OR team2_id = $1) ' +
        'AND winning_team_id IS NULL;';
    try {
        const res = await client.query(queryString, [teamID]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}