var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comments");
// =========================================
// COMMENTS ROUTE
// =========================================

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

router.get("/new", isLoggedIn, function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
        }
        else {
            console.log(campground)
            res.render("comments/new", { campground: campground });
        }
    })
});

router.post("/", isLoggedIn, function(req, res) {
    //look up campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            console.log(req.body.comment);
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                }
                else {
                    //add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    //save the comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    //redirect to campground homepage
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
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