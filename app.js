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
app.set("view engine", "hbs")
app.use(express.static(__dirname + "/public"));
// const { User } = require("./model/user.js/index.js")

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

app.use(require("./controllers"))






// app.post("/login", urlencoder, function (req, res) {
//     let username = req.body.un
//     let password = req.body.pw
//     User.findOne({
//         username,
//         password
//     }, function (err, doc) {
//         if (err) {
//             res.send(err)
//         } else if (doc) {
//             req.session.username = doc.username
//             res.redirect("/")
//         } else {
//             res.send("User not found!")
//         }
//     })
// })

// app.get("/login", function(req,res){
//     res.sendFile(__dirname + "/public/login.html")
// })

// app.get("/signup", function(req,res){
//     res.sendFile(__dirname+ "/public/signup.html")
// })

// app.get("/play", function(req,res){

//     if(req.session.username){
//         res.render("play.hbs", {
//             username: req.session.username
//         })
//     }else{
//         res.redirect("/")
//     }
// })

// app.get("/profile", function(req,res){
//     if(req.session.username){
//         res.render("profile.hbs", {
//             username: req.session.username,
//             elo: req.session.elo
//         })
//     }else{
//         res.redirect("/")
//     }
// })

// app.get("/logout", function(req,res){
//     req.session.destroy((err)=>{
//         console.log("ERROR destroying cookie")
//     })
//     res.redirect("/")
// })

app.listen(3000, function (req, res) {
    console.log("port 3000 is listening...");
})

