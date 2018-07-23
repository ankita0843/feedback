// require dependencies
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var cors = require('cors');


var reviewRoute = require('./routes/reviews');
var newResponseRoute = require('./routes/responses_new');
var userRoute = require('./routes/users');
//var studentRoute = require('./routes/student');

var app = express();

// Connect to database
mongoose.connect('localhost/conFusion');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log('Connected correctly to server');
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());


// use the routes

app.use(reviewRoute);
app.use(newResponseRoute);
app.use(userRoute);
//app.use(studentRoute);
// Start server
app.listen(3000, function () {
    console.log("REST API has Started!!");
});
