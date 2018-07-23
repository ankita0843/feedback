var express = require('express');
var router = express.Router();
var passport = require('passport');
var Admin = require('../models/admin');
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var upload = require('../public/js/upload.js');
var uploadprof= require('../public/js/uploadprof.js');


router.use(bodyParser.json());

function getForm(data, elem) {
    for (var i = 0; i < data.length; i++) {
        if (data[i]._id == elem) {
            return data[i];
        }
    }
    return -1;
}


router.get("/", function (req, res) {

    if (req.user) {

        // We need to pass the data of reviews to the view

        var createdForms = req.user.created_forms;
        
        console.log(createdForms.length);
        var formsInSystem = [];
        var finalForms = [];
        var renderData = [];

        console.log("im here");

        // TODO: handle case where createdForms is not consistent with REST API

        // for each created form get the form data, store it in a new array
        // render the view with that array

        if (createdForms.length == 0) {
            res.render("landing", {forms: null});
        } else {
            
            // Get all reviews in system
            
            request('http://localhost:3000/reviews', function (error, response) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(response.body);
                    var data = JSON.parse(response.body);
                    console.log(data);
                    for (var i = 0; i < createdForms.length; i++) {
                        form = getForm(data, createdForms[i]);
                        if (form != -1) {
                            finalForms.push(form);
                        }
                        

                    }

                    if (finalForms.length == 0) {
                        res.render("landing", {forms: null});
                    } else {
                        res.render("landing", {forms: finalForms});
                    }
                }
            });
        }
    }
    else {
        res.render("landing", {forms: null});
    }

});



/*

router.get("/", function (req, res) {

    if (req.user) {

        // We need to pass the data of reviews to the view

        var info1 = req.user.aum;
        
        console.log(info1.length);
       finalInfo=[];
        console.log("im here");

        // TODO: handle case where createdForms is not consistent with REST API

        // for each created form get the form data, store it in a new array
        // render the view with that array

        if (info1.length == 0) {
            res.render("landing", {aums: null});
        } else {
            
            // Get all reviews in system
            
            request('http://localhost:3000/student', function (error, response) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(response.body);
                    var data = JSON.parse(response.body);
                    console.log(data);
                    for (var i = 0; i < info1.length; i++) {
                        info = getinfo(data, info1[i]);
                        if (info!= -1) {
                            finalInfo.push(info);
                        }
                        

                    }

                    if (finalInfo.length == 0) {
                        res.render("landing", {aums: null});
                    } else {
                        res.render("landing", {aums: finalInfo});
                    }
                }
            });
        }
    }
    else {
        res.render("landing", {aums: null});
    }

});*/
// TEST ROUTES

router.get("/success", function (req, res) {
    res.send("Success!!");
});

router.get("/failed", function (req, res) {
    res.send("Failure!!");
});


router.post("/register", function (req, res) {
    var newAdmin = new Admin(
        {
            username: req.body.username,
            //department: req.body.department,
            email: req.body.email,
            full_name: req.body.full_name
        }
    );
    Admin.register(newAdmin, req.body.password, function (err, admin) {
        // admin is newly created admin
        if (err) {
            console.log(err);
            return res.render("landing");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        });
    });
});

// handle login logic

// the middleware uses authenticate method which authenticates user..if it works it redirects somewhere else somewhere else

router.post("/login", passport.authenticate("local",
    {successRedirect: "/", failureRedirect: "/failed"}), function (req, res) {
});

// logout

router.get("/logout", function (req, res) {
    req.logout();
    // flash message

    // req.flash("success", "Logout successful");
    res.redirect("/");
});



router.get("/admins", function (req, res) {
    Admin.find({}, function (err, foundAdmins) {
        if (err) {
            console.log(err);
        } else {
            res.json(foundAdmins);
        }
    })
});

router.put("/admins/:adminId/created_forms", function (req, res) {
    console.log("From PUT route", req.body);
    Admin.findById(req.params.adminId, function (err, admin) {
        if (err) {
            console.log(err);
        }

        // check if review_id already exists

        var toAdd = true;

        for (var i = 0; i < admin.created_forms.length; ++i) {
            if (admin.created_forms[i] == req.body.review_id) {
                toAdd = false;
            }
        }
        if (toAdd == true) {
            admin.created_forms.push(req.body.review_id);
        }
        admin.save(function (err, admin) {
            if (err) throw err;
            else{
                res.json({message: "ok"});  
            }
        });
    });
});

router.get("/details", function (req, res) {
    res.render("view-stats");
});


router.get("/details/:reviewId", function (req, res) {
    var reviewId = req.params.reviewId;
    res.render("view-stats", {reviewId: reviewId});
});


router.get("/create_review", function (req, res) {
    res.render("create-form");
});


router.get("/edit_form/:reviewId", function (req, res){
    var reviewId = req.params.reviewId;
    res.render("edit_form", {reviewId: reviewId});

});

/*router.delete('/delete/created_forms:id', function (req, res) {
    admins.adminId.created_forms.findById(req.params.id)
    db.collection.update({id:admins.adminId }, {$pull:{"created_forms":{ id:(req.params.id)}}})
        .exec(function(err, doc) {
            if (err || !doc) {
                res.statusCode = 404;
                res.send({});
            } else {
                doc.remove(function(err) {
                    if (err) {
                        res.statusCode = 403;
                        res.send(err);
                    } else {
                        res.send({});
                    }
                });
            }
        }); 
});*/

router.post('/', upload.post);
router.post('/prof', uploadprof.post);
 module.exports = router;


