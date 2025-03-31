const db = require('./db.js');

const client = db.client;

module.exports.showMatchSim = showMatchSim;

async function showMatchSim(req, res) {
    let twoTeamsResults = await loadTwoTeams();

    res.render('match_sim', {
        twoTeams: twoTeamsResults
    });
}

const loadTwoTeams = async () => {
    queryString = 'SELECT id, team_name FROM team ORDER BY RANDOM() LIMIT 2';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}