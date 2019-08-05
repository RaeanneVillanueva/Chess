const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bodyparser = require("body-parser")

const app = express()

const urlencoder = bodyparser.urlencoded({
    extended: true
})

router.use(urlencoder)
router.use(bodyparser.json())

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
        // res.render("home", {
        //     username: user.username
        // })
        res.redirect("/")
    }, (error) => {
        res.render(signup, {
            error: "Oops :'( there was an error"}
        )
        console.log("ERROR signing up")
    })
})

router.post("/login", urlencoder, (req, res) => {
    console.log("POST /user/login")
    errorMessage = ""
    let user = {
        username: req.body.username,
        password: req.body.password
    }
    console.log("post login " + req.body.username + "|")
    console.log("post login " + req.body.password + "|")
    console.log("post login " + user)

    if(!req.body.username){//res.send can send text
        errorMessage = "Please input a username"
        console.log(errorMessage)
        res.set('Content-Type', 'text/plain')
        res.send(errorMessage)
    } else if (!req.body.password) {
        errorMessage = "Please input a password"
        console.log(errorMessage)
        res.set('Content-Type', 'text/plain')
        res.send(errorMessage)
    } else{
        User.authenticate(user).then((newUser) => {
            console.log("authenticate " + newUser)
            if (newUser) {
                req.session.username = user.username
                // res.render and res.redirect does not work with ajax, both send html block which would only be read as text
                // res.render("home", {
                //     username: user.username
                // })
                // res.redirect("/")

            } else {
                errorMessage = "Account does not exist!"
                console.log(errorMessage)
                res.set('Content-Type', 'text/plain')
                res.send(errorMessage)

                // testing for to make sure names can still be sent
                // req.session.username = errorMessage
            }
        }, (error) => {
            console.log(error)
        })
    }
})


// always remember to export the router for index.js
module.exports = router