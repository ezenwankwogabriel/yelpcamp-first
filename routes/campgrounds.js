var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});



//OPEN ALL CAMPGROUNDS
router.get("/", function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res) {
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
router.get("/new", middleware.isLoggedIn, function(req, res) {
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

//EDIT CAMPGROUND ROUTEE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log("error finding ID");
        } else{
          res.render("campgrounds/edit", {campground: foundCampground});

        }
    });
});


//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
        //could either do the below, or put all inside a campground array in the edit.ejs file
        //var data={name:req.body.name, image:req.body.image, description:req.body.description}
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        } else {
            //redirect somewhere(showPage)
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

//middleWare




module.exports = router;