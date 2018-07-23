/*var myApp = angular.module('clientApp5', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});
*/

var csv = require('fast-csv');
var mongoose = require('mongoose');
var Student = require('F:/project/node_examples/client-app-2-new/models/studentInfo.js');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/client-app-2';


//myApp.controller('AdminController', ['$scope', '$window', '$http', function ($scope, $window, $http) {

exports.post = function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
    var studentFile = req.files.file;
    
 
    var students = [];
         
    csv
     .fromString(studentFile.data.toString(), {
         headers: true,
         ignoreEmpty: true
     })
     .on("data", function(data){
         data['_id'] = new mongoose.Types.ObjectId();
          
         students.push(data);
     })
     .on("end", function(){
         Student.create(students, function(err, documents) {
            if (err) throw err;
       
          
         res.send(students.length + ' students have been successfully uploaded.');
        });
    });  
   };
  



var data;

var studentretrieve = function (db, callback) {
    db.collection('studentinfos').find().toArray(function (err, aum){
console.log("wwwwww");
    aum.forEach(function (err, doc) {

        if (doc != null) {
            console.dir(doc);

        } else {
            callback();
        }
    });
});
};

MongoClient.connect(url, function (err, db) {

    studentretrieve(db, function () {
        db.close();
    });
});
/*console.log("hvhgvhgvg");
  var postReq = {
            method: 'POST',
            url: 'http://localhost:3000/student/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: studentretrieve,
            
        };
        /*$http(postReq).then(function (response) {
                console.log("Ok..", response);
            },
                function (response) {
                console.log("Not Ok..", response);
            }
        );
        }]);*/