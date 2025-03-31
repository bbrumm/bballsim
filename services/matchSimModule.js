const db = require('./db.js');

const client = db.client;

module.exports.showMatchSim = showMatchSim;
module.exports.showResultsOfMatchSim = showResultsOfMatchSim;

async function showMatchSim(req, res) {
    console.log('Request Body for Show: ', req.body);

    //buttonWasClicked = determineButtonThatWasClicked(req.body);

    //if (buttonWasClicked) {
        //Match Sim button was clicked before reload, so store the result
        
        //storeMatchSimResult

    //}

    //Show teams regardless of button being clicked
    let twoTeamsResults = await loadTwoTeams();

    res.render('match_sim', {
        twoTeams: twoTeamsResults,
        resultOfInsert: false
    });
}

async function showResultsOfMatchSim(req, res) {
    console.log('Request Body after Submit: ', req.body);

    team1Score = await calculateTeamScore();
    team2Score = await calculateTeamScore();

    console.log('Match scores: ' + team1Score + ' vs ' + team2Score);

    //Calculate winner of match
    //winningTeamID = await calculateMatchWinner(req.body.team1ID, req.body.team2ID);
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
    resultOfInsert = await storeMatchSimResult(winningTeamID, losingTeamID, winningTeamScore, losingTeamScore);
    console.log('Match result inserted, response is ', resultOfInsert);

    let twoTeamsResults = await loadTwoTeams();

    res.render('match_sim', {
        twoTeams: twoTeamsResults,
        resultOfInsert: resultOfInsert,
        winningTeamID: winningTeamID,
        losingTeamID: losingTeamID,
        winningTeamScore: winningTeamScore,
        losingTeamScore: losingTeamScore,
        winningTeamName: winningTeamName,
        losingTeamName: losingTeamName
    });

}

const loadTwoTeams = async () => {
    queryString = 'SELECT id, team_name, team_rating FROM team ORDER BY RANDOM() LIMIT 2';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
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

async function calculateTeamScore() {
    min = 70;
    max = 140;
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

async function storeMatchSimResult(winningTeamID, losingTeamID, winningTeamScore, losingTeamScore) {
    console.log("* Insert the match result: winning team ID ("+ winningTeamID +"), losing team ID ("+ losingTeamID +")");
    queryString = "INSERT INTO match_result (winning_team_id, losing_team_id, winning_team_score, losing_team_score) VALUES ($1, $2, $3, $4)";
    console.log("Query string: " + queryString);
    try {
        result = await client.query(queryString, [winningTeamID, losingTeamID, winningTeamScore, losingTeamScore]);
        return await isInsertSuccessful(result);
    } catch (error) {
        console.error(error.stack);
        return false;
    }
}

async function isInsertSuccessful(insertQueryResult) {
    if (insertQueryResult.rowCount == 1) {
        return true;
    } else {
        return false;
    }
}


