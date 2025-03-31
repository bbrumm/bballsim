//jshint esversion:8
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = 8000;

const teamListModule = require(__dirname + "/services/teamListModule");
const matchSimModule = require(__dirname + "/services/matchSimModule");

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    //res.send('Hello World!');
    teamListModule.showStandings(req, res);
});

app.get('/match_sim', (req, res) => {
    matchSimModule.showMatchSim(req, res);
});


app.listen(port, () => {
  console.log('Example app listening on port ${port}!');
});