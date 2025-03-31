const commonDataLookups = require('./commonDataLookups.js');

module.exports.showHome = showHome;

async function showHome(req, res) {
    gameParameters = await commonDataLookups.lookupChosenTeamID();
    chosenTeamID = gameParameters[0].team_id_chosen;

    teamDetails = await commonDataLookups.lookupTeamDetails(chosenTeamID);
    teamMatchResults = await commonDataLookups.lookupMatchResultsForTeam(chosenTeamID);
    playerDetails = await commonDataLookups.lookupPlayerDetailsForTeam(chosenTeamID);
    teamOverallPosition = await commonDataLookups.lookupOverallRecordForTeam(chosenTeamID);
    nextMatchDetails = await commonDataLookups.lookupNextMatchForTeam(chosenTeamID);

    nextMatchOpponentTeamName = await calculateNextMatchOpponentTeamName(chosenTeamID, nextMatchDetails);

    res.render('home', {
        teamDetails: teamDetails,
        teamID: chosenTeamID,
        teamMatchResults: teamMatchResults,
        teamOverallPosition: teamOverallPosition,
        nextMatchOpponentTeamName: nextMatchOpponentTeamName
    });
}

async function calculateNextMatchOpponentTeamName(chosenTeamID, nextMatchDetails) {
    if (nextMatchDetails[0].team1_id == chosenTeamID) {
        //Team 1 is the currently viewed team, so the opponent is Team 2
        return nextMatchDetails[0].team2_name
    } else {
        //Opposite: the opponent is Team 1
        return nextMatchDetails[0].team1_name
    }
}