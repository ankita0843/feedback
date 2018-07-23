// REDUCED app.js file

// ====Refer to app.js for development purpose====

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var expressSession = require('express-session');
var cors = require('cors');
var fileUpload = require('express-fileupload');
var Admin = require('./models/admin');
var indexRoutes = require('./routes/index');

var app = express();

// mongoose.connect("mongodb://localhost/client-app-2");
mongoose.connect('localhost/client-app-2');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(fileUpload());

app.use(express.static(__dirname + "/public"));
console.log(__dirname);


app.use(expressSession({
    secret: "Little mini is very busy",
    resave: false,
    saveUninitialized: false
}));


// PASSPORT CONFIGURATION

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
// User.authenticate(),User.serializeUser() and User.deserializeUser() are methods that come with passport-local-mongoose


app.set("view engine", "ejs");

// middleware to pass data to templates

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


// use the routes
// app.use(commentRoutes);
// app.use(campgroundRoutes);

app.use(indexRoutes);


app.listen(8000, function () {
    console.log("Client App 2 has Started!!");
});
/*
var upload = require('./public/js/upload.js');
app.post('/', upload.post);

app.get('/', function (req, res) {
  res.sendFile('./views/landing.ejs');
});*/