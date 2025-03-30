//jshint esversion:8
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = 8000;

const teamListModule = require(__dirname + "/services/teamListModule");

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  //res.send('Hello World!');
  teamListModule.showExample(req, res);
});


app.listen(port, () => {
  console.log('Example app listening on port ${port}!');
});