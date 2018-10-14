const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db.js');
var routesController = require('./controllers/routesController');

var app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.listen(3000,() => console.log('SK- server started at port : 3000'));
app.use('/routes',routesController);



