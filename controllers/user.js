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
        loses: 0
    }


    User.create(user).then((user) => {
        console.log("successful " + user)
        req.session.username = user.username
        res.render("home", {
            username: user.username
        })
        res.redirect("/")
    }, (error) => {
        console.log("ERROR signing up")
        res.redirect("/user/signup")
    })
})

router.post("/login", (req, res) => {
    console.log("POST /user/login")
    let user = {
        username: req.body.username,
        password: req.body.password
    }
    console.log("post login " + req.body.username)
    console.log("post login " + user)

    User.authenticate(user).then((newUser) => {
        console.log("authenticate " + newUser)
        if (newUser) {
            req.session.username = user.username
            res.render("home", {
                username: user.username
            })
            res.redirect("/")
        } else {
            res.render("login",{
                error: "Account not found"
            })
        }
    }, (error) => {
        console.log("ERROR in logging in")
        res.redirect("/user/login")
    })
})


// always remember to export the router for index.js
module.exports = router