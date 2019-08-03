var express = require("express")
const bodyparser = require("body-parser")
const app = express()
const session = require("express-session")
const urlencoder = bodyparser.urlencoded({
    extended: false
})
const cookieparser = require("cookie-parser")
const mongoose = require("mongoose")
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/chessusers", {
    useNewUrlParser: true
})

const { User } = require("./user.js")

app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: "LOGIN_INFO",
    name: "login",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 2
    }
}))
app.use(cookieparser())

app.get("/", function (req, res) {
    console.log(req.session.username)
    if (!req.session.username)
        res.sendFile(__dirname + "/public/splash.html")
    else
        res.render("home.hbs", {
            username: req.session.username
        })
})

app.post("/signup", urlencoder, function (req, res) {
    var username = req.body.un
    var password = req.body.pw

    let user = new User({
        username,
        password,
        elo: 1200
    })

    user.save().then(function (doc) {
        console.log(doc);
        req.session.username = doc.username

        res.render("home.hbs", {
            username: doc.username,
            elo: doc.elo
        })
    }, function (err) {
        res.send(err);
    })
})


app.post("/login", urlencoder, function (req, res) {
    let username = req.body.un
    let password = req.body.pw
    User.findOne({
        username,
        password
    }, function (err, doc) {
        if (err) {
            res.send(err)
        } else if (doc) {
            req.session.username = doc.username
            res.redirect("/")
        } else {
            res.send("User not found!")
        }
    })
})

app.get("/login", function(req,res){
    res.sendFile(__dirname + "/public/login.html")
})

app.get("/signup", function(req,res){
    res.sendFile(__dirname+ "/public/signup.html")
})

app.get("/play", function(req,res){
    res.render("play.hbs", {})
})

app.get("/profile", function(req,res){

})

app.listen(3000, function (req, res) {
    console.log("port 3000 is listening...");
})

