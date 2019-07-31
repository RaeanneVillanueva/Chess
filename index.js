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
mongoose.connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true
})

const {User} = require("./user.js")

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/chessSplash.html");
})

app.post("/signup", urlencoder, function(req, res){
    var username = req.body.un
    var password = req.body.pw

    let user = new User({
        username,
        password
    })

    user.save().then(function(doc){
        console.log(doc);
        res.render("chessHome.hbs", {
            username: doc.username
        })
    },function(err){
        res.send(err);
    })
})





app.listen(3000, function(req,res){
    console.log("port is listening...");
})

 