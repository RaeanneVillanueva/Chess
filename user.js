const mongoose = require("mongoose")

var User = mongoose.model("user",{
    username: String,
    password: String,
    elo: Number,
    wins: Number,
    loses: Number
})

module.exports = {
    User
}