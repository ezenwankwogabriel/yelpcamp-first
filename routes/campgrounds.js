var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comments");

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});



//OPEN ALL CAMPGROUNDS
router.get("/", isLoggedIn, function(req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds 
            //, currentUser: req.user 
            });
        }
    })
})

//POST REQUEST TO SUBMIT NEW CAMPGROUND DETAIL
router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    //Adding user data to the campground
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author: author }
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    })
});

//FORM FOR NEW CAMPGROUND
router.get("/new", function(req, res) {
    res.render("campgrounds/new");
})

//SHOW MOR`E DETAILS OF CAMPGROUND WHEN CLICKED
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(foundCampground)
            res.render("campgrounds/show", { campground: foundCampground})
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

module.exports = router;
