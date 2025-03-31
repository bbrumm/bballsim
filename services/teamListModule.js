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
    queryString = 'SELECT ' +
        'id, ' +
        'team_name, ' +
        'SUM(wins) AS wins, ' +
        'SUM(losses) AS losses, ' +
        'SUM(points_for) AS points_for, ' +
        'SUM(points_against) AS points_against ' +
        'FROM ( ' +
            'SELECT ' +
            't.id, ' +
            't.team_name, ' +
            'COUNT(rw.id) AS wins, ' +
            '0 AS losses, ' +
            'SUM(rw.winning_team_score) AS points_for, ' +
            'SUM(rw.losing_team_score) AS points_against ' +
            'FROM team t ' +
            'LEFT JOIN match_result rw ON t.id = rw.winning_team_id ' +
            'GROUP BY t.id, t.team_name ' +
            'UNION ALL ' +
            'SELECT ' +
            't.id, ' +
            't.team_name, ' +
            '0 AS wins, ' +
            'COUNT(rl.id) AS losses, ' +
            'SUM(rl.losing_team_score) AS points_for, ' +
            'SUM(rl.winning_team_score) AS points_against ' +
            'FROM team t ' +
            'LEFT JOIN match_result rl ON t.id = rl.losing_team_id ' +
            'GROUP BY t.id, t.team_name ' +
        ') s ' +
        'GROUP BY id, team_name ' +
        'ORDER BY SUM(wins) DESC, SUM(losses) ASC, SUM(points_for) DESC, SUM(points_against) ASC;';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}