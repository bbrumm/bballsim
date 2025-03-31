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

    team1Score = 50;
    team2Score = 25;

    //Calculate winner of match
    //winningTeamID = await calculateMatchWinner(req.body.team1ID, req.body.team2ID);
    winningTeamID = await calculateMatchWinner(req, team1Score, team2Score);
    losingTeamID = await calculateMatchLoser(req, winningTeamID);

    console.log('Winning team ID: ' + winningTeamID);
    console.log('Losing team ID: ' + losingTeamID);

    //Store the result of the match
    resultOfInsert = await storeMatchSimResult(winningTeamID, losingTeamID);
    console.log('Match result inserted, response is ', resultOfInsert);

    let twoTeamsResults = await loadTwoTeams();

    res.render('match_sim', {
        twoTeams: twoTeamsResults,
        resultOfInsert: resultOfInsert
    });

}

const loadTwoTeams = async () => {
    queryString = 'SELECT id, team_name FROM team ORDER BY RANDOM() LIMIT 2';
    try {
        const res = await client.query(queryString);
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

async function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function storeMatchSimResult(winningTeamID, losingTeamID) {
    console.log("* Insert the match result: winning team ID ("+ winningTeamID +"), losing team ID ("+ losingTeamID +")");
    queryString = "INSERT INTO match_result (winning_team_id, losing_team_id) VALUES ($1, $2)";
    console.log("Query string: " + queryString);
    try {
        result = await client.query(queryString, [winningTeamID, losingTeamID]);
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


