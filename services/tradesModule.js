const commonDataLookups = require('./commonDataLookups.js');

module.exports.showTrades = showTrades;
module.exports.confirmTrade = confirmTrade;

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

async function confirmTrade(req, res) {
    gameParameters = await commonDataLookups.lookupChosenTeamID();
    chosenTeamID = gameParameters[0].team_id_chosen;

    otherPlayer = await commonDataLookups.lookupSinglePlayerStats(req.body.radioPlayerOpen);
    otherPlayerTeamID = otherPlayer[0].team_id;

    let tradeYourPlayer = {
        playerID: req.body.radioPlayerYourTeam,
        oldTeamID: chosenTeamID,
        newTeamID: otherPlayerTeamID
    };

    let tradeOtherPlayer = {
        playerID: req.body.radioPlayerOpen,
        oldTeamID: otherPlayerTeamID,
        newTeamID: chosenTeamID
    };

    console.log("Your Player: ", req.body.radioPlayerYourTeam);
    console.log("Chosen Player: ", req.body.radioPlayerOpen);
    console.log("Your Player Object: ", tradeYourPlayer);
    res.render('trade_submitted', {
        tradeYourPlayer: tradeYourPlayer,
        tradeOtherPlayer: tradeOtherPlayer
    });
}