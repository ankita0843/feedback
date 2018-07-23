var express = require('express');
var router = express.Router();
var passport = require('passport');
var Admin = require('../models/admin');
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');


router.use(bodyParser.json());

function inArray(array, value) {
    for (var i = 0; i < array.length; ++i) {
        if (array[i] == value) {
            return i;
        }
    }
    return -1;
}

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
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
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
                    // Getting all forms in system
                    /*for (var i = 0; i < data.length; ++i) {
                        formsInSystem.push(data[i]._id);
                    }*/
                    for (var i = 0; i < createdForms.length; i++) {
                        form = getForm(data, createdForms[i]);
                        if (form != -1) {
                            finalForms.push(form);
                        }
                        

                    }
                    //console.log("forms in system:", formsInSystem);
                    /*for (var x = 0; x < createdForms.length; ++x) {
                        if (inArray(formsInSystem, createdForms[x]) == -1) {
                            // form does not exist in system
                            // delete it
                            createdForms.splice(x, 1);
                            finalForms.push()
                            console.log("deleted inconsistent data");

                            // TODO: delete this data from database too so that next time it runs more efficiently
                            
                        }
                    }*/
                    //console.log("created forms:", createdForms);

                    if (finalForms.length == 0) {
                        res.render("landing", {forms: null});
                    } else {
                        //createdForms.forEach(function (formId, index) {

                            /*request('http://localhost:3000/reviews/' + formId, function (error, response, body) {
                                if (error) {
                                    console.log("##########################################3");
                                    console.log(error);
                                } else {
                                    console.log(formId);
                                    console.log(index);
                                    console.log("*************************");

                                    renderData.push(JSON.parse(response.body));
                                    if (index == createdForms.length - 1) {
                                        // last form has been pushed
                                        // data is ready to be rendered
                                        console.log("done");
                                        res.render("landing", {forms: renderData})
                                    }
                                }
                            });*/
                            //console.log(formId);
                        //});

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

module.exports = router;