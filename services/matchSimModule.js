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
        twoTeams: twoTeamsResults
    });
}

async function showResultsOfMatchSim(req, res) {
    console.log('Request Body after Submit: ', req.body);

    //Calculate winner of match
    winningTeamID = await calculateMatchWinner(req.body.team1ID, req.body.team2ID);

    //Calculate loser of match
    if (winningTeamID == req.body.team1ID) {
        losingTeamID = req.body.team2ID;
    } else {
        losingTeamID = req.body.team1ID;
    }

    console.log('Winning team ID: ' + winningTeamID);
    console.log('Losing team ID: ' + losingTeamID);

    //Store the result of the match
    storeMatchSimResult(winningTeamID, losingTeamID);
    console.log('Match result stored');

    let twoTeamsResults = await loadTwoTeams();

    res.render('match_sim', {
        twoTeams: twoTeamsResults
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



async function calculateMatchWinner(teamID1, teamID2) {
    
    randomInt = await getRandomInt(10);
    console.log('Random Int: ' + randomInt);
    if (randomInt % 2 == 0) {
        console.log('Team 1 wins');
        return teamID1;
    } else {
        console.log('Team 2 wins');
        return teamID2;
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
    } catch (error) {
        console.error(error.stack);
    }
}


function determineButtonThatWasClicked(requestBody) {
    if (requestBody == undefined) {
        return false;
    } else if ("sim_match" in requestBody) {
        return true;
    } else {
        return false;
    }
}