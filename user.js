const mongoose = require("mongoose")

var User = mongoose.model("user",{
    username: String,
    password: String,
    elo: Number
})

module.exports = {
    User
}