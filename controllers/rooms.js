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
    if(req.session.username){
        res.render("rooms", {
            username: req.session.username
        })
    }else{
        res.redirect("/")
    }
})

module.exports = router;