const db = require('./db.js');
const client = db.client;
const commonDataLookups = require('./commonDataLookups.js');

module.exports.showStandings = showStandings;

async function showStandings(req, res) {
    let teamListResults = await loadTeamList();

    gameParameters = await commonDataLookups.lookupChosenTeamID();
    chosenTeamID = gameParameters[0].team_id_chosen;

    //console.log('Team List: ', teamListResults); 
    let teamList = teamListResults;

    res.render('index', {
        teamList: teamList,
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
        'points_against ' +
        'FROM standings ' +
        'ORDER BY wins DESC, losses ASC, points_for DESC, points_against ASC;';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}