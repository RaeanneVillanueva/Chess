const express = require("express")
const router = express.Router()
const User = require("../models/user")

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
                gamesPlayed: user.wins + user.loses,
                wins: user.wins,
                loses: user.loses,
                draws: user.draws
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
            res.render("admin", {
                users: users
            })
        })
    }
})

router.post("/deleteuser", function (req, res) {
    let id = req.body.id
    console.log("POST /deleteuser " + id)
    User.delete(id).then(doc => {
        res.send(doc)
    })
})

router.get("/edituser", (req, res) => {
    console.log("GET /getuser " + req.query.id)
    let id = req.query.id
    User.get(id).then(user => {
        res.render("edit-user", {
            user
        })
    })
})

router.post("/edituser", function (req, res) {
    console.log("POST /update")
    let id = req.body.id
    let username = req.body.username
    let elo = req.body.elo
    let wins = req.body.wins
    let loses = req.body.loses
    let draws = req.body.draws

    var u = {
        username,
        elo,
        wins,
        loses,
        draws
    }

    User.edit(id, u).then(user => {
        console.log("Successfully edited")
        res.redirect("/admin")
    })
})

router.get("*", function (req, res) {
    res.send("Quiet out here (・_・) . . . Oh, we didn't find the page you were looking for . . . sorry")
})

module.exports = router