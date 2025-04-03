const db = require('./db.js');
const client = db.client;
const commonDataLookups = require('./commonDataLookups.js');

module.exports.showStandings = showStandings;
module.exports.showStandingsByConf = showStandingsByConf;

async function showStandings(req, res) {
    teamListResults = await loadTeamList();

    gameParameters = await commonDataLookups.lookupChosenTeamID();
    chosenTeamID = gameParameters[0].team_id_chosen;

    //console.log('Team List: ', teamListResults); 
    let teamList = teamListResults;

    res.render('standings', {
        isOverall: true,
        teamList: teamList,
        chosenTeamID: chosenTeamID
    });
}

async function showStandingsByConf(req, res) {
    standingsEast = await commonDataLookups.lookupStandings(1);
    standingsWest = await commonDataLookups.lookupStandings(2);

    gameParameters = await commonDataLookups.lookupChosenTeamID();
    chosenTeamID = gameParameters[0].team_id_chosen;

    res.render('standings', {
        isOverall: false,
        standingsEast: standingsEast,
        standingsWest: standingsWest,
        chosenTeamID: chosenTeamID
    });
}


const loadTeamList = async () => {
    //queryString = 'SELECT id, team_name FROM team';
    //TODO: update this query to remove team_name and team_rating from the inner query,
    //and join to the team table outside the query, so we only get these fields once
    queryString = 'SELECT ' +
        'pos, ' +
        'id, ' +
        'team_name, ' +
        'team_rating, ' +
        'wins, ' +
        'losses, ' +
        'points_for, ' +
        'points_against, ' +
        'conference_name ' +
        'FROM standings ' +
        'ORDER BY wins DESC, losses ASC, points_for DESC, points_against ASC;';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}
