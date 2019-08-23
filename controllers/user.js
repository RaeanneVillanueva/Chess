const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bodyparser = require("body-parser")

const app = express()

const urlencoder = bodyparser.urlencoded({
    extended: true
})

router.use(urlencoder)

// localhost:3000/user/login
router.get("/login", function (req, res) {
    console.log("GET /user/login")
    res.render("login", {})
})

// localhost:3000/user/signup
router.get("/signup", function (req, res) {
    console.log("GET /user/signup")
    res.render("signup", {})
})


router.post("/signup", (req, res) => {
    console.log("POST /user/signup")
    var user = {
        username: req.body.username,
        password: req.body.password,
        elo: 1200,
        wins: 0,
        loses: 0,
        draws: 0
    }

    User.create(user).then((user) => {
        console.log("successful " + user)
        req.session.username = user.username
        req.session.user = user
        res.redirect("/")
    }, (error) => {
        res.render("signup", {
            error
        })
    })

})

router.post("/login", (req, res) => {
    console.log("POST /user/login")
    if (req.body.username == "admin" && req.body.password == "admin") {
        req.session.admin = true
        res.redirect("/admin")
    } else {

        let user = {
            username: req.body.username,
            password: req.body.password
        }
        console.log("post login " + req.body.username)
        console.log("post login " + user)

        User.authenticate(user).then((newUser) => {
            console.log("authenticate " + newUser)
            if (newUser) {
                req.session.username = newUser.username
                req.session.user = newUser
                res.redirect("/")
            }
        }, (error) => {
            res.render("login", {
                error
            })
        })
    }
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


// always remember to export the router for index.js
module.exports = router