const commonDataLookups = require('./commonDataLookups.js');

module.exports.showFinances = showFinances;

async function showFinances(req, res) {
    gameParameters = await commonDataLookups.lookupGameParameters();
    chosenTeamID = gameParameters[0].team_id_chosen;

    teamFinancesResult = await commonDataLookups.lookupTeamFinances();
    teamTotalSalaryResult = await commonDataLookups.lookupTotalTeamSalary(chosenTeamID);
    teamNumberOfRemainingMatches = await commonDataLookups.lookupNumberOfRemainingMatchesForTeam(chosenTeamID);


    let teamFinances = {
        bankBalance: new Intl.NumberFormat().format(
            teamFinancesResult[0].team_bank_balance
        ),
        incomePerGame: new Intl.NumberFormat().format(
            teamFinancesResult[0].income_per_game
        ),
        totalSalary: new Intl.NumberFormat().format(
            teamTotalSalaryResult[0].total_salary
        ),
        projectedIncome: new Intl.NumberFormat().format(
            teamNumberOfRemainingMatches[0].match_count * teamFinancesResult[0].income_per_game
        ),
        projectedEndOfYearBalance: new Intl.NumberFormat().format(
            teamFinancesResult[0].team_bank_balance + 
            (teamNumberOfRemainingMatches[0].match_count * teamFinancesResult[0].income_per_game) - 
            teamTotalSalaryResult[0].total_salary
        )
    }


    res.render('finances', {
        teamFinances: teamFinances
    });
}

