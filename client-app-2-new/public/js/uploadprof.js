var csv = require('fast-csv');
var mongoose = require('mongoose');
var Prof = require('F:/project/node_examples/client-app-2-new/models/profInfo.js');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/client-app-2';


//myApp.controller('AdminController', ['$scope', '$window', '$http', function ($scope, $window, $http) {

exports.post = function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
    var profFile = req.files.file;
    
 
    var profs = [];
         
    csv
     .fromString(profFile.data.toString(), {
         headers: true,
         ignoreEmpty: true
     })
     .on("data", function(data){
         data['_id'] = new mongoose.Types.ObjectId();
          
         profs.push(data);
     })
     .on("end", function(){
         Prof.create(profs, function(err, documents) {
            if (err) throw err;
       
          
         res.send(profs.length + ' profs have been successfully uploaded.');
        });
    });  
   };
  



var data;

var Profretrieve = function (db, callback) {
    db.collection('profinfos').find().toArray(function (err, aum1){
console.log("wwwwww");
    aum1.forEach(function (err, doc) {

        if (doc != null) {
            console.dir(doc);

        } else {
            callback();
        }
    });
});
};

MongoClient.connect(url, function (err, db) {

    Profretrieve(db, function () {
        db.close();
    });
});