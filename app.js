var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    Campground          = require("./models/campground"),
    Comment             = require("./models/comments"),
    User                = require("./models/user"), 
    seedDB              = require("./seeds");
    
mongoose.Promise = global.Promise; 

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes =require("./routes/index");


// seedDB(); //seed the database

mongoose.connect("mongodb://localhost/yelp_camp_v8", { useMongoClient: true });    
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty  wins cutest dog",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(error, body) {
    console.log("the YelpCamp Server has Started");
});
