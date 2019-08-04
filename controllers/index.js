const express = require("express")
const router = express.Router()
const app = express()

router.use("/user", require("./user"))

router.get("/", function (req, res) {
    console.log("GET /")
    if (!req.session.username)
        res.render("splash", {})
    else
        res.render("home", {
            username: req.session.username
        })
})

router.get("/play", function(req,res){
    console.log("GET /play ")
    if(req.session.username){
        res.render("play.hbs", {
            username: req.session.username
        })
    }else{
        res.redirect("/")
    }
})

router.get("/profile", function(req,res){
    console.log("GET /profile")
    if(req.session.username){
        res.render("profile.hbs", {
            username: req.session.username,
            elo: req.session.elo
        })
    }else{
        res.redirect("/")
    }
})

module.exports = router