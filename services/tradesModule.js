const commonDataLookups = require('./commonDataLookups.js');

module.exports.showTrades = showTrades;

async function showTrades(req, res) {
    gameParameters = await commonDataLookups.lookupChosenTeamID();
    chosenTeamID = gameParameters[0].team_id_chosen;

    playerDetailsForTeam = await commonDataLookups.lookupPlayerDetailsForTeam(chosenTeamID);
    //console.log('playerDetailsForTeam: ', playerDetailsForTeam);

    playersOpenToTrade = await commonDataLookups.lookupOpenToTradePlayers(chosenTeamID);
    
    res.render('trades', {
        playerDetailsForTeam: playerDetailsForTeam,
        playersOpenToTrade: playersOpenToTrade
    });
}

