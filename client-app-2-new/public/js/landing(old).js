
var app = require('express');
var fileUpload = require('express-fileupload');
var mongoose = require('mongoose');
 
var server = require('http').Server(app);
module.exports = router;


 
app.use(fileUpload());
 
server.listen(80);
 
mongoose.connect('mongodb://localhost/csvimport');
 

var upload = require('./upload.js');
app.post('/', upload.post);

app.get('/', function (req, res) {
  res.sendFile('./views/landing.ejs');
});