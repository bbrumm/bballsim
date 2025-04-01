const db = require('./db.js');
const client = db.client;

const commonDataLookups = require('./commonDataLookups.js');

module.exports.showStats = showStats;


async function showStats(req, res) {
    playerStats = await commonDataLookups.lookupPlayerStats();
    gameParameters = await commonDataLookups.lookupChosenTeamID();
    chosenTeamID = gameParameters[0].team_id_chosen;

    //console.log('playerStats: ', playerStats);
    //console.log('chosenTeamID: ' + chosenTeamID);

    res.render('stats', {
        playerStats: playerStats,
        chosenTeamID: chosenTeamID
    });
}

