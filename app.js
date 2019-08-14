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
mongoose.connect("mongodb://localhost:27017/chessusers", {
    useNewUrlParser: true
})
app.set("view engine", "hbs")
app.use(express.static(__dirname + "/public"));


app.use(session({
    secret: "LOGIN_INFO",
    name: "login",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 2
    }
}))
app.use(cookieparser())

app.use(require("./controllers"))



app.listen(3000, function (req, res) {
    console.log("port 3000 is listening...");
})

