const commonDataLookups = require('./commonDataLookups.js');

module.exports.showPlayerPage = showPlayerPage;

async function showPlayerPage(req, res) {
    console.log('Request Query: ', req.query);

    playerDetails = await commonDataLookups.lookupSinglePlayerStats(req.query.playerID);
    //teamMatchResults = await commonDataLookups.lookupMatchResultsForTeam(req.query.teamID);
    //playerDetails = await commonDataLookups.lookupPlayerDetailsForTeam(req.query.teamID);
    //teamOverallPosition =await commonDataLookups.lookupOverallRecordForTeam(req.query.teamID);

    res.render('player', {
        playerDetails: playerDetails
    });
}

