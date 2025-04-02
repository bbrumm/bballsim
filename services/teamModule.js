const commonDataLookups = require('./commonDataLookups.js');

module.exports.showTeamPage = showTeamPage;

async function showTeamPage(req, res) {
    console.log('Request Query: ', req.query);

    teamDetails = await commonDataLookups.lookupTeamDetails(req.query.teamID);
    teamMatchResults = await commonDataLookups.lookupMatchResultsForTeam(req.query.teamID);
    playerDetails = await commonDataLookups.lookupPlayerDetailsForTeam(req.query.teamID);
    teamOverallPosition = await commonDataLookups.lookupOverallRecordForTeam(req.query.teamID);

    res.render('team', {
        teamDetails: teamDetails,
        teamID: req.query.teamID,
        playerDetails: playerDetails,
        teamMatchResults: teamMatchResults,
        teamOverallPosition: teamOverallPosition
    });
}

