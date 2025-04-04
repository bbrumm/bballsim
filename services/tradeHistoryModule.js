const commonDataLookups = require('./commonDataLookups.js');

module.exports.showTradeHistory = showTradeHistory;

async function showTradeHistory(req, res) {
    tradeHistoryResults = await commonDataLookups.lookupTradeHistory();

    res.render('trade_history', {
        tradeHistoryResults: tradeHistoryResults
    });
}

