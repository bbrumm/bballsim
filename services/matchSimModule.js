const db = require('./db.js');
const client = db.client;

const commonDataLookups = require('./commonDataLookups.js');

module.exports.showMatchSim = showMatchSim;
module.exports.showResultsOfMatchSim = showResultsOfMatchSim;

async function showMatchSim(req, res) {
    //This is shown if no match is simulated

    console.log('Request Body for Show: ', req.body);

    gameParameters = await commonDataLookups.lookupChosenTeamID();
    chosenTeamID = gameParameters[0].team_id_chosen;

    
    //Show teams regardless of button being clicked
    let nextMatchDetails = await commonDataLookups.lookupNextMatch();
    isNextMatchIncludeChosenTeam = await calculateIsNextMatchIncludeChosenTeam(chosenTeamID, nextMatchDetails);

    team1OverallPosition = await commonDataLookups.lookupOverallRecordForTeam(nextMatchDetails[0].team1_id);
    team2OverallPosition = await commonDataLookups.lookupOverallRecordForTeam(nextMatchDetails[0].team2_id);


    res.render('match_sim', {
        nextMatchDetails: nextMatchDetails,
        resultOfInsert: false,
        isNextMatchIncludeChosenTeam: isNextMatchIncludeChosenTeam,
        team1OverallPosition: team1OverallPosition,
        team2OverallPosition: team2OverallPosition
    });
}

async function showResultsOfMatchSim(req, res) {
    //This is shown if a match simulation was just completed

    console.log('Request Body after Submit: ', req.body);

    //Calculate player scores
    team1PlayerMatchStats = await calculatePlayerMatchStats(req.body.team1ID);
    team2PlayerMatchStats = await calculatePlayerMatchStats(req.body.team2ID);

    matchResultID = req.body.matchResultID;

    console.log('Team 1 player stats: ', team1PlayerMatchStats);
    console.log('Team 2 player stats: ', team2PlayerMatchStats);

    team1Score = await calculateTeamScore(team1PlayerMatchStats);
    team2Score = await calculateTeamScore(team2PlayerMatchStats);

    console.log('Match scores: ' + team1Score + ' vs ' + team2Score);

    //Calculate winner of match
    //TODO: this could be refactored and improved
    winningTeamID = await calculateMatchWinner(req, team1Score, team2Score);
    losingTeamID = await calculateMatchLoser(req, winningTeamID);
    winningTeamScore = await setWinningTeamScore(team1Score, team2Score);
    losingTeamScore = await setLosingTeamScore(team1Score, team2Score);
    winningTeam = await lookupTeamDetails(winningTeamID);
    losingTeam = await lookupTeamDetails(losingTeamID);
    winningTeamName = winningTeam[0].team_name;
    losingTeamName = losingTeam[0].team_name;

    console.log('Winning team: ' + winningTeamName + ', ID ' + winningTeamID);
    console.log('Losing team: ' + losingTeamName + ', ID ' + losingTeamID);

    //Store the result of the match
    resultOfInsert = await storeMatchSimResult(matchResultID, winningTeamID, losingTeamID, winningTeamScore, losingTeamScore, team1PlayerMatchStats, team2PlayerMatchStats);
    console.log('Match result inserted, response is ', resultOfInsert);

    let nextMatchDetails = await commonDataLookups.lookupNextMatch();
    isNextMatchIncludeChosenTeam = await calculateIsNextMatchIncludeChosenTeam(chosenTeamID, nextMatchDetails);

    team1OverallPosition = await commonDataLookups.lookupOverallRecordForTeam(nextMatchDetails[0].team1_id);
    team2OverallPosition = await commonDataLookups.lookupOverallRecordForTeam(nextMatchDetails[0].team2_id);


    res.render('match_sim', {
        nextMatchDetails: nextMatchDetails,
        resultOfInsert: resultOfInsert,
        winningTeamID: winningTeamID,
        losingTeamID: losingTeamID,
        winningTeamScore: winningTeamScore,
        losingTeamScore: losingTeamScore,
        winningTeamName: winningTeamName,
        losingTeamName: losingTeamName,
        isNextMatchIncludeChosenTeam: isNextMatchIncludeChosenTeam,
        team1OverallPosition: team1OverallPosition,
        team2OverallPosition: team2OverallPosition
    });

}



async function lookupTeamDetails(teamID) {
    queryString = 'SELECT team_name FROM team WHERE id = $1';
    try {
        const res = await client.query(queryString, [teamID]);
        //console.log('Team name: ' + res.rows[0].team_name);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}

async function calculatePlayerMatchStats(teamID) {
    /*
    This function will find the players involved in the recently-simulated match,
    calculate the number of points for each player, 
    insert them into the database, and return these results.
    They are used to calculate the team's score later.
    */

    //Get players for each team
    teamPlayers = await lookupPlayerDetailsForTeam(teamID);

    //Loop through players and calculate a score for them
    for (i = 0; i < teamPlayers.length; i++) {
        teamPlayers[i].points = await calculatePlayerPoints(teamPlayers[i].rating_ovr);
        teamPlayers[i].rebounds = await calculatePlayerRebounds(teamPlayers[i].rating_ovr);
        teamPlayers[i].assists = await calculatePlayerAssists(teamPlayers[i].rating_ovr);
        teamPlayers[i].steals = await calculatePlayerSteals(teamPlayers[i].rating_ovr);
        teamPlayers[i].blocks = await calculatePlayerBlocks(teamPlayers[i].rating_ovr);
    }
    return teamPlayers;

}

async function calculateTeamScore(teamPlayerMatchStats) {
    /*
    min = 70;
    max = 140;
    baseScore = Math.floor(Math.random() * (max - min + 1)) + min;
    finalScore = Math.round(baseScore * teamRating / 100, 0);
    console.log('Final score: ' + finalScore);
    return finalScore;
    */
    finalScore = 0;

    for (i = 0; i < teamPlayerMatchStats.length; i++) {
        finalScore = finalScore + teamPlayerMatchStats[i].points;
    }

    return finalScore;


}

async function calculatePlayerPoints(playerRating) {
    min = 0;
    max = 30;
    baseScore = Math.floor(Math.random() * (max - min + 1)) + min;
    finalScore = Math.round(baseScore * playerRating / 100, 0);
    return finalScore;
}

async function calculatePlayerRebounds(playerRating) {
    min = 0;
    max = 20;
    baseScore = Math.floor(Math.random() * (max - min + 1)) + min;
    finalScore = Math.round(baseScore * playerRating / 100, 0);
    return finalScore;
}

async function calculatePlayerAssists(playerRating) {
    min = 0;
    max = 15;
    baseScore = Math.floor(Math.random() * (max - min + 1)) + min;
    finalScore = Math.round(baseScore * playerRating / 100, 0);
    return finalScore;
}

async function calculatePlayerSteals(playerRating) {
    min = 0;
    max = 5;
    baseScore = Math.floor(Math.random() * (max - min + 1)) + min;
    finalScore = Math.round(baseScore * playerRating / 100, 0);
    return finalScore;
}

async function calculatePlayerBlocks(playerRating) {
    min = 0;
    max = 15;
    baseScore = Math.floor(Math.random() * (max - min + 1)) + min;
    finalScore = Math.round(baseScore * playerRating / 100, 0);
    return finalScore;
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

async function calculateMatchWinner(req, team1Score, team2Score) {
    //randomInt = await getRandomInt(10);
    //console.log('Random Int: ' + randomInt);
    if (team1Score >= team2Score) {
        console.log('Team 1 wins');
        return req.body.team1ID;
    } else {
        console.log('Team 2 wins');
        return req.body.team2ID;
    }
}

async function calculateMatchLoser(req, winningTeamID) {
    if (winningTeamID == req.body.team1ID) {
        return req.body.team2ID;
    } else {
        return req.body.team1ID;
    }
}

async function setWinningTeamScore(team1Score, team2Score) {
    if (team1Score >= team2Score) {
        return team1Score;
    } else {
        return team2Score;
    }
}

async function setLosingTeamScore(team1Score, team2Score) {
    if (team1Score >= team2Score) {
        return team2Score;
    } else {
        return team1Score;
    }
}

async function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function storeMatchSimResult(
    matchResultID, winningTeamID, losingTeamID, winningTeamScore, losingTeamScore, team1PlayerMatchStats, team2PlayerMatchStats
) {
    //Store the match result
    matchResultResponse = await updateMatchResult(matchResultID, winningTeamID, losingTeamID, winningTeamScore, losingTeamScore);
    console.log('matchResultResponse ', matchResultResponse);
    numberOfInsertedRows = matchResultResponse.rowCount;
    
    //insertedMatchResult = await findInsertedMatchResultID();
    //console.log('insertedMatchResult ', insertedMatchResult);
    //insertedMatchResultID = insertedMatchResult.rows[0].max_id;

    team1PlayerInserted = await insertPlayerStats(matchResultID, team1PlayerMatchStats);
    team2PlayerInserted = await insertPlayerStats(matchResultID, team2PlayerMatchStats);
   
    return (numberOfInsertedRows == 1);
    
}

async function insertPlayerStats(matchResultID, teamPlayerMatchStats) {
    //Insert player stats
    //We do this one by one, as the pg library does not support bulk insert
    //I could use a different library, but it's probably not worth it for the small volumes of data here.
    for (i = 0; i < teamPlayerMatchStats.length; i++) {
        queryString = "INSERT INTO player_match_stats " +
            "(match_result_id, player_id, points_scored, rebounds, assists, steals, blocks) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7);";
        //console.log("Insert Match Stats query: " + queryString);
        //console.log("Match Result ID: " + matchResultID);
        //console.log("Player ID: " + teamPlayerMatchStats[i].id);
        //console.log("Player Points: " + teamPlayerMatchStats[i].points);
        try {
            result = await client.query(
                queryString, 
                [matchResultID, 
                teamPlayerMatchStats[i].id, 
                teamPlayerMatchStats[i].points, 
                teamPlayerMatchStats[i].rebounds,
                teamPlayerMatchStats[i].assists,
                teamPlayerMatchStats[i].steals,
                teamPlayerMatchStats[i].blocks
                ]
            );
        } catch (error) {
            console.error(error.stack);
        }
    }
}

async function updateMatchResult(matchResultID, winningTeamID, losingTeamID, winningTeamScore, losingTeamScore) {
    console.log("* Update the match result: winning team ID ("+ winningTeamID +"), losing team ID ("+ losingTeamID +")");
    queryString = "UPDATE match_result " +
        "SET winning_team_id = $1, " +
        "losing_team_id = $2, " +
        "winning_team_score = $3, " +
        "losing_team_score = $4 " +
        "WHERE id = $5;";
    console.log("Query string: " + queryString);
    try {
        result = await client.query(
            queryString, 
            [winningTeamID, losingTeamID, winningTeamScore, losingTeamScore, matchResultID]
        );
        //return await isInsertSuccessful(result);
        return result;
    } catch (error) {
        console.error(error.stack);
    }
}

async function findInsertedMatchResultID() {
    queryString = "SELECT MAX(id) AS max_id FROM match_result";
    try {
        result = await client.query(queryString);
        return result;
    } catch (error) {
        console.error(error.stack);
    }
}


async function isInsertSuccessful(insertQueryResult) {
    if (insertQueryResult.rowCount == 1) {
        return true;
    } else {
        return false;
    }
}

async function calculateIsNextMatchIncludeChosenTeam(chosenTeamID, nextMatchDetails) {
    if (nextMatchDetails[0].team1_id == chosenTeamID ||
        nextMatchDetails[0].team2_id == chosenTeamID) {   
        return true;
    } else {
        return false;
    }
}
