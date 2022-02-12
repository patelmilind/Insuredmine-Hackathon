'use strict';

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Set up CORS
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(cors({
    origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
}));

app.use(express.json());
// This responds with "Hello World" on the homepage
app.get('/serverTest', function (req, res) {
   console.log("Server Alive!!!");
   res.send('Server Alive!!!');
});

app.use('/api/client', require('./clients/index'));
app.use('/api/proposal', require('./proposal/index'));

var server = app.listen(9000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

