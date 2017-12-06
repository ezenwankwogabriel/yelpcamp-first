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

//edit comment
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else
    res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
    });
})

//comment update
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

//comment destroy route
router.delete("/:comment_id",  function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})


//middleWare

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}


function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){    
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else{
           //does user own the comment?(Authorization)
          if(foundComment.author.id.equals(req.user.id)){
              next();
          } else{
              res.redirect("back");
          }
       }
    });
} else {
    res.redirect("back");
    }
}


module.exports = router;