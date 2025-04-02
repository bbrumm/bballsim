const db = require('./db.js');
const client = db.client;

const commonDataLookups = require('./commonDataLookups.js');

module.exports.showMatchHistory = showMatchHistory;

async function showMatchHistory(req, res) {

    let matchHistoryResults = await commonDataLookups.getMatchHistory();
    let chosenTeamID = gameParameters[0].team_id_chosen;

    res.render('match_history', {
        matchHistoryResults: matchHistoryResults,
        chosenTeamID: chosenTeamID
    });
}