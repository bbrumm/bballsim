const db = require('./db.js');
const client = db.client;



module.exports.lookupTeamDetails = lookupTeamDetails;
module.exports.lookupMatchResultsForTeam = lookupMatchResultsForTeam;
module.exports.lookupPlayerDetailsForTeam = lookupPlayerDetailsForTeam;
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
module.exports.lookupGameParameters = lookupGameParameters;
module.exports.lookupTotalTeamSalary = lookupTotalTeamSalary;
module.exports.lookupNumberOfRemainingMatchesForTeam = lookupNumberOfRemainingMatchesForTeam;
module.exports.lookupOpenToTradePlayers = lookupOpenToTradePlayers;
module.exports.storeCompletedTrade = storeCompletedTrade;
module.exports.updateTeamForPlayer = updateTeamForPlayer;
module.exports.recalculateTeamOverallRating = recalculateTeamOverallRating;
module.exports.updateTeamBankBalanceAfterMatch = updateTeamBankBalanceAfterMatch;
module.exports.lookupTradeHistory = lookupTradeHistory;
module.exports.lookupBestPlayers = lookupBestPlayers;



async function lookupTeamDetails(teamID) {
    queryString = await openQueryFile("lookupTeamDetails");

    try {
        const res = await client.query(queryString, [teamID]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function openQueryFile(filename) {
    let fs = require('fs');
    let queryFolder = './queries/';
    let fullFilename = queryFolder + filename + '.sql';
    //return queryFolder;
    /*fs.readFile(queryFolder + filename + '.sql', function (err, data) {
        if (err) throw err;
        console.log("File data: ", data);
        return data;
      });
      */
     fileData = fs.readFileSync(fullFilename, 'utf8');
     return fileData;
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
        'po.short_name, ' +
        'SUM(s.points_scored) AS points_scored, ' +
        'SUM(COALESCE(s.rebounds, 0)) AS rebounds, ' +
        'SUM(COALESCE(s.assists, 0)) AS assists, ' +
        'SUM(COALESCE(s.steals, 0)) AS steals, ' +
        'SUM(COALESCE(s.blocks, 0)) AS blocks, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.points_scored) / COUNT(DISTINCT s.id), 1) AS ppg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_position po ON p.position_id = po.id ' +
        'LEFT JOIN player_match_stats s ON p.id = s.player_id ' +
        'WHERE t.id = $1 ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, p.annual_salary, po.short_name ' +
        'ORDER BY p.rating_ovr DESC;';
    try {
        const res = await client.query(queryString, [teamID]);
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
    'ORDER BY win_rate DESC, losses ASC, points_for DESC, points_against ASC;';
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
        'po.short_name, ' +
        'SUM(s.points_scored) AS points_scored, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.points_scored * 1.0) / COUNT(DISTINCT s.id), 1) AS ppg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_position po ON p.position_id = po.id ' +
        'INNER JOIN player_match_stats s ON p.id = s.player_id ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id, po.short_name ' +
        'ORDER BY ppg DESC LIMIT 20;';
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
        'po.short_name, ' +
        'SUM(s.rebounds) AS rebounds, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.rebounds * 1.0) / COUNT(DISTINCT s.id), 1) AS rpg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_match_stats s ON p.id = s.player_id ' +
        'INNER JOIN player_position po ON p.position_id = po.id ' +
        'WHERE s.rebounds IS NOT NULL ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id, po.short_name ' +
        'ORDER BY rpg DESC LIMIT 20;';
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
        'po.short_name, ' +
        'SUM(s.assists) AS assists, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.assists * 1.0) / COUNT(DISTINCT s.id), 1) AS apg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_match_stats s ON p.id = s.player_id ' +
        'INNER JOIN player_position po ON p.position_id = po.id ' +
        'WHERE s.assists IS NOT NULL ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id, po.short_name ' +
        'ORDER BY apg DESC LIMIT 20;';
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
        'po.short_name, ' +
        'SUM(s.steals) AS steals, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.steals * 1.0) / COUNT(DISTINCT s.id), 1) AS spg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_match_stats s ON p.id = s.player_id ' +
        'INNER JOIN player_position po ON p.position_id = po.id ' +
        'WHERE s.steals IS NOT NULL ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id, po.short_name ' +
        'ORDER BY spg DESC LIMIT 20;';
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
        'po.short_name, ' +
        'SUM(s.blocks) AS blocks, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.blocks * 1.0) / COUNT(DISTINCT s.id), 1) AS bpg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_match_stats s ON p.id = s.player_id ' +
        'INNER JOIN player_position po ON p.position_id = po.id ' +
        'WHERE s.blocks IS NOT NULL ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id, po.short_name ' +
        'ORDER BY bpg DESC LIMIT 20;';
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
        'po.short_name, ' +
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
        'INNER JOIN player_position po ON p.position_id = po.id ' +
        'WHERE p.id = $1 ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id, po.short_name';
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
        "ORDER BY win_rate DESC, losses ASC, points_for DESC, points_against ASC;";
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


async function lookupGameParameters() {
    queryString = 'SELECT team_id_chosen, team_bank_balance, income_per_game ' +
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

async function lookupOpenToTradePlayers(teamID) {
    queryString = 'SELECT ' +
        'p.id, ' +
        'p.first_name, ' +
        'p.last_name, ' +
        'p.rating_ovr, ' +
        'p.annual_salary, ' +
        'po.short_name, ' +
        't.team_name  ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_position po ON p.position_id = po.id ' +
        'WHERE p.open_to_trade = TRUE ' +
        'AND t.id != $1;';
    try {
        const res = await client.query(queryString, [teamID]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function storeCompletedTrade(tradedPlayer) {
    queryString = 'INSERT INTO complete_trade (create_datetime, player_id, old_team_id, new_team_id) ' +
        'VALUES (CURRENT_TIMESTAMP, $1, $2, $3);';
    try {
        const res = await client.query(
            queryString, [
                tradedPlayer.playerID,
                tradedPlayer.oldTeamID,
                tradedPlayer.newTeamID
            ]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function updateTeamForPlayer(tradedPlayer) {
    queryString = 'UPDATE player SET team_id = $1 WHERE id = $2;';
    try {
        const res = await client.query(
            queryString, [
                tradedPlayer.newTeamID,
                tradedPlayer.playerID
            ]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function recalculateTeamOverallRating(teamID) {
    queryString = 'UPDATE team AS mt ' +
        'SET team_rating = r.new_team_rating ' +
        'FROM ( ' +
            'SELECT ' +
            'team_id, ' +
            'ROUND(AVG(rating_ovr), 0) AS new_team_rating ' +
            'FROM ( ' +
                'SELECT ' +
                't.id AS team_id, ' +
                'p.id AS player_id, ' +
                'p.rating_ovr, ' +
                'ROW_NUMBER() OVER ( ' +
                    'PARTITION BY t.id ' +
                    'ORDER BY p.rating_ovr DESC ' +
                ') AS player_order ' +
                'FROM player p ' +
                'INNER JOIN team t ON p.team_id = t.id ' +
                'ORDER BY t.id ASC, p.rating_ovr DESC ' +
            ') s ' +
            'WHERE s.player_order <= 8 ' +
            'GROUP BY team_id ' +
        ') AS r ' +
        'WHERE mt.id = r.team_id AND mt.id = $1;';
    try {
        const res = await client.query(queryString, [teamID]);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function updateTeamBankBalanceAfterMatch() {
    queryString = 'UPDATE game_parameters ' +
        'SET team_bank_balance = team_bank_balance + income_per_game;';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function lookupTradeHistory() {
    queryString = 'SELECT ' +
        'c.id, ' +
        'c.create_datetime, ' +
        'c.player_id, ' +
        'p.first_name, ' +
        'p.last_name, ' +
        'c.old_team_id, ' +
        'ot.team_name AS old_team_name, ' +
        'c.new_team_id, ' +
        'nt.team_name AS new_team_name, ' +
        'p.rating_ovr ' +
        'FROM complete_trade c ' +
        'INNER JOIN team ot ON c.old_team_id = ot.id ' +
        'INNER JOIN team nt ON c.new_team_id = nt.id ' +
        'INNER JOIN player p ON c.player_id = p.id ' +
        'ORDER BY id DESC;'
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function lookupBestPlayers() {
    queryString = 'SELECT ' +
        'sub.id, ' +
        'p.first_name, ' +
        'p.last_name, ' +
        't.id AS team_id, ' +
        't.team_name, ' +
        'p.rating_ovr, ' +
        'po.short_name, ' +
        'games_played, ' +
        'ppg, ' +
        'rpg, ' +
        'apg, ' +
        'spg, ' +
        'bpg, ' +
        'ppg + (0.5 * rpg) + spg + (0.7 * apg) + (0.7 * bpg) AS game_score ' +
        'FROM ( ' +
            'SELECT ' +
            'p.id, ' +
            'COUNT(DISTINCT s.id) AS games_played,  ' +
            'SUM(s.points_scored) AS points_scored,  ' +
            'ROUND(SUM(s.points_scored * 1.0) / COUNT(DISTINCT s.id), 1) AS ppg, ' +
            'SUM(s.rebounds) AS rebounds,  ' +
            'ROUND(SUM(s.rebounds * 1.0) / COUNT(DISTINCT s.id), 1) AS rpg, ' +
            'SUM(s.assists) AS assists,  ' +
            'ROUND(SUM(s.assists * 1.0) / COUNT(DISTINCT s.id), 1) AS apg, ' +
            'SUM(s.steals) AS steals,  ' +
            'ROUND(SUM(s.steals * 1.0) / COUNT(DISTINCT s.id), 1) AS spg, ' +
            'SUM(s.blocks) AS blocks,  ' +
            'ROUND(SUM(s.blocks * 1.0) / COUNT(DISTINCT s.id), 1) AS bpg ' +
            'FROM player p  ' +
            'INNER JOIN player_match_stats s ON p.id = s.player_id  ' +
            'GROUP BY p.id ' +
        ') sub ' +
        'INNER JOIN player p ON p.id = sub.id ' +
        'INNER JOIN team t ON p.team_id = t.id  ' +
        'INNER JOIN player_position po ON p.position_id = po.id ' +
        'ORDER BY game_score DESC LIMIT 20; ';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}