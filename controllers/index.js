const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Puzzle = require("../models/puzzle")

const bodyparser = require("body-parser")
const urlencoder = bodyparser.urlencoded({
    extended: true
})
router.use(urlencoder)
router.use("/user", require("./user"))
router.use("/play", require("./play"))
router.use("/rooms", require("./rooms"))

router.get("/", function (req, res) {
    console.log("GET /")
    if (!req.session.username) {
        res.render("index.hbs")
    } else {
        res.render("play", {
            username: req.session.username
        })
    }
})

router.get("/about", function(req,res){
    if (!req.session.username) {
        res.render("index.hbs")
    } else {
        res.render("aboutUs", {
            username: req.session.username
        })
    }
})

router.get("/profile", function (req, res) {
    console.log("GET /profile")
    if (req.session.username) {
        User.getByUsername(req.session.username).then((user) => {
            res.render("profile.hbs", {
                username: req.session.username,
                elo: user.elo,
                gamesPlayed: user.wins + user.loses + user.draws,
                wins: user.wins,
                loses: user.loses,
                draws: user.draws,
                dateCreated: user.dateCreated
            })
        }, (err) => {
            console.log(err)
        })

    } else {
        res.redirect("/")
    }
})

router.get("/logout", function (req, res) {
    req.session.destroy((err) => {
        console.log("ERROR destroying cookie")
    })
    res.redirect("/")
})

router.get("/admin", function (req, res) {
    if (!req.session.admin) {
        res.redirect("/")
    } else {
        User.getAll().then((users) => {
            Puzzle.getAll().then((puzzles)=>{
                res.render("admin", {
                    users: users,
                    puzzles: puzzles
                })
                
            })
        })
    }
})


router.post("/deletepuzzle", function(req,res){
    let id = req.body.id
    console.log("POST /deletepuzzle " + id)
    Puzzle.delete(id).then(doc =>{
        res.send(doc)
    })
})



router.get("*", function (req, res) {
    res.send("Quiet out here (・_・) . . . Oh, we didn't find the page you were looking for . . . sorry")
})

module.exports = router