const db = require('./db.js');

const client = db.client;

module.exports.showStandings = showStandings;

async function showStandings(req, res) {
    let teamListResults = await loadTeamList();

    //console.log('Team List: ', teamListResults); 
    let teamList = teamListResults;

    res.render('index', {
        teamList: teamList
    });
}


const loadTeamList = async () => {
    //queryString = 'SELECT id, team_name FROM team';
    queryString = 'SELECT t.id, t.team_name, ' +
        '(SELECT COUNT(*) FROM match_result WHERE winning_team_id = t.id) AS wins, ' +
        '(SELECT COUNT(*) FROM match_result WHERE losing_team_id = t.id) AS losses ' +
        'FROM team t ' +
        'ORDER BY wins DESC, losses DESC;';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}