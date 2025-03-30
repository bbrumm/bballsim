const db = require('./db.js');

const client = db.client;

module.exports.showExample = showExample;

async function showExample(req, res) {
    //console.log('show example here');
    //let teamList = 'some new team';

    let teamListResults = await loadTeamList();

    console.log('Team List: ', teamListResults); 
    let teamList = teamListResults;

    res.render('index', {
        teamList: teamList
    });
}


const loadTeamList = async () => {
    queryString = 'SELECT id, team_name FROM team';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}