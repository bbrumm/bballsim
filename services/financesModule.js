const commonDataLookups = require('./commonDataLookups.js');

module.exports.showFinances = showFinances;

async function showFinances(req, res) {
    gameParameters = await commonDataLookups.lookupChosenTeamID();
    chosenTeamID = gameParameters[0].team_id_chosen;

    teamFinancesResult = await commonDataLookups.lookupTeamFinances();
    teamTotalSalaryResult = await commonDataLookups.lookupTotalTeamSalary(chosenTeamID);

    let teamFinances = {
        bankBalance: new Intl.NumberFormat().format(teamFinancesResult[0].team_bank_balance),
        incomePerGame: new Intl.NumberFormat().format(teamFinancesResult[0].income_per_game),
        totalSalary: new Intl.NumberFormat().format(teamTotalSalaryResult[0].total_salary)
    }


    res.render('finances', {
        teamFinances: teamFinances
    });
}

