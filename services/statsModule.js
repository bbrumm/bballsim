const db = require('./db.js');

const client = db.client;

module.exports.showStats = showStats;


async function showStats(req, res) {
    playerStats = await lookupPlayerStats();

    console.log('playerStats: ', playerStats);

    res.render('stats', {
        playerStats: playerStats
    });
}

async function lookupPlayerStats() {
    queryString = 'SELECT ' +
        'p.id, ' +
        'p.first_name, ' +
        'p.last_name, ' +
        't.id AS team_id, ' +
        't.team_name, ' +
        'p.rating_ovr, ' +
        'SUM(s.points_scored) AS points_scored, ' +
        'COUNT(DISTINCT s.id) AS games_played, ' +
        'ROUND(SUM(s.points_scored) / COUNT(DISTINCT s.id), 1) AS ppg ' +
        'FROM player p ' +
        'INNER JOIN team t ON p.team_id = t.id ' +
        'INNER JOIN player_match_stats s ON p.id = s.player_id ' +
        'GROUP BY p.id, p.first_name, p.last_name, p.rating_ovr, t.team_name, t.id ' +
        'ORDER BY SUM(s.points_scored) DESC;';
    try {
        const res = await client.query(queryString);
        return res.rows;
    } catch (error) {
        console.log(error)
    }
}