//jshint esversion:8
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const port = 8000;

const standingsModule = require(__dirname + "/services/standingsModule");
const matchSimModule = require(__dirname + "/services/matchSimModule");
const teamModule = require(__dirname + "/services/teamModule");
const statsModule = require(__dirname + "/services/statsModule");
const homeModule = require(__dirname + "/services/homeModule");
const playerModule = require(__dirname + "/services/playerModule");
const matchHistoryModule = require(__dirname + "/services/matchHistoryModule");
const playoffsModule = require(__dirname + "/services/playoffsModule");
const financesModule = require(__dirname + "/services/financesModule");
const tradesModule = require(__dirname + "/services/tradesModule");
const tradeHistoryModule = require(__dirname + "/services/tradeHistoryModule");

app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboard cat'
  }));

//This USE command is required in order to load the CSS file
app.use(express.static(__dirname));

//These two commands are used so that Node can process form submissions
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', (req, res) => {
  homeModule.showHome(req, res);
});

app.get('/standings/', (req, res) => {
  standingsModule.showStandings(req, res);
});

app.get('/playoffs/', (req, res) => {
  playoffsModule.showPlayoffs(req, res);
});

app.get('/trade_history/', (req, res) => {
  tradeHistoryModule.showTradeHistory(req, res);
});

app.get('/standings_conf/', (req, res) => {
  standingsModule.showStandingsByConf(req, res);
});

app.get('/home/', (req, res) => {
  homeModule.showHome(req, res);
});

app.get('/finances/', (req, res) => {
  financesModule.showFinances(req, res);
});

app.get('/trades/', (req, res) => {
  tradesModule.showTrades(req, res);
});

app.post('/trade_submitted/', (req, res) => {
  tradesModule.confirmTrade(req, res);
});

app.get('/match_sim', (req, res) => {
    matchSimModule.showMatchSim(req, res);
});

app.post('/match_sim_result', (req, res) => {
    matchSimModule.showResultsOfMatchSim(req, res);
});

app.get('/match_history', (req, res) => {
  matchHistoryModule.showMatchHistory(req, res);
});

app.get('/team/', (req, res) => {
  teamModule.showTeamPage(req, res);
});

app.get('/player/', (req, res) => {
  playerModule.showPlayerPage(req, res);
});

app.get('/stats/', (req, res) => {
  statsModule.showStats(req, res);
});


app.listen(port, () => {
  console.log('Example app listening on port ${port}!');
});