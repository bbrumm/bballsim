const db = require('./db.js');
const client = db.client;

const commonDataLookups = require('./commonDataLookups.js');

module.exports.showStats = showStats;


async function showStats(req, res) {
    playerStatsPoints = await commonDataLookups.lookupPlayerStatsPoints();
    playerStatsRebounds = await commonDataLookups.lookupPlayerStatsRebounds();
    playerStatsAssists = await commonDataLookups.lookupPlayerStatsAssists();
    playerStatsSteals = await commonDataLookups.lookupPlayerStatsSteals();
    playerStatsBlocks = await commonDataLookups.lookupPlayerStatsBlocks();
    gameParameters = await commonDataLookups.lookupGameParameters();
    chosenTeamID = gameParameters[0].team_id_chosen;

    //console.log('playerStats: ', playerStats);
    //console.log('chosenTeamID: ' + chosenTeamID);

    res.render('stats', {
        playerStatsPoints: playerStatsPoints,
        playerStatsRebounds: playerStatsRebounds,
        playerStatsAssists: playerStatsAssists,
        playerStatsSteals: playerStatsSteals,
        playerStatsBlocks: playerStatsBlocks,
        chosenTeamID: chosenTeamID
    });
}

