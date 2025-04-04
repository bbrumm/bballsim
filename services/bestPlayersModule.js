const db = require('./db.js');
const client = db.client;

const commonDataLookups = require('./commonDataLookups.js');

module.exports.showBestPlayers = showBestPlayers;


async function showBestPlayers(req, res) {
    bestPlayers = await commonDataLookups.lookupBestPlayers();
    gameParameters = await commonDataLookups.lookupGameParameters();
    chosenTeamID = gameParameters[0].team_id_chosen;

    

    res.render('best_players', {
        bestPlayers: bestPlayers,
        chosenTeamID: chosenTeamID
    });
}

