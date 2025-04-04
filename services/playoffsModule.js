const db = require('./db.js');
const client = db.client;

const commonDataLookups = require('./commonDataLookups.js');

module.exports.showPlayoffs = showPlayoffs;

async function showPlayoffs(req, res) {
    standingsEast = await commonDataLookups.lookupStandings(1);
    standingsWest = await commonDataLookups.lookupStandings(2);

    gameParameters = await commonDataLookups.lookupGameParameters();
    chosenTeamID = gameParameters[0].team_id_chosen;

    res.render('playoffs', {
        standingsEast: standingsEast,
        standingsWest: standingsWest,
        chosenTeamID: chosenTeamID
    });
}
