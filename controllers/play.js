const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bodyparser = require("body-parser")

const app = express()

const urlencoder = bodyparser.urlencoded({
    extended: true
})

router.use(urlencoder)

router.get("/", function(req,res){
    console.log("GET /play ")
    if(req.session.username){
        res.render("play.hbs", {
            username: req.session.username
        })
    }else{
        res.redirect("/")
    }
})

router.get("/online", function(req,res){
    res.render("online-mode", {
        username: req.session.username
    })
})

module.exports = router