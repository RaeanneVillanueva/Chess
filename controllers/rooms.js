const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bodyparser = require("body-parser")

const app = express()
const rooms = {}
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

router.post("/room", function(req,res){
    if(rooms[req.body.room] != null){
        return res.redirect("/rooms")
    }

    rooms[req.body.room] = {users:{}}
    res.redirect("/rooms/" + req.body.room)
})

router.get("/:room", function(req,res){
    if(rooms[req.params.room] == null){
        return res.redirect("/rooms")
    }
    res.render('room', {roomName: req.params.room})
})

module.exports = router;