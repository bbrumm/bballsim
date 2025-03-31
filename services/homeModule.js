const commonDataLookups = require('./commonDataLookups.js');

module.exports.showHome = showHome;

async function showHome(req, res) {
    gameParameters = await commonDataLookups.lookupChosenTeamID();
    chosenTeamID = gameParameters[0].team_id_chosen;

    teamDetails = await commonDataLookups.lookupTeamDetails(chosenTeamID);
    teamMatchResults = await commonDataLookups.lookupMatchResultsForTeam(chosenTeamID);
    playerDetails = await commonDataLookups.lookupPlayerDetailsForTeam(chosenTeamID);

    res.render('home', {
        teamDetails: teamDetails,
        teamID: chosenTeamID,
        teamMatchResults: teamMatchResults
    });
}