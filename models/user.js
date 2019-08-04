const mongoose = require("mongoose")
// const crypto = require("crypto")

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    elo: Number,
    wins: Number,
    loses: Number
})

userSchema.pre("save", function (next) {
      this.password = this.password
      this.elo = 1200
      this.wins = 0
      this.loses = 0
      next()
})

var User = mongoose.model("chessuser", userSchema)

exports.create = function (user) {
    return new Promise(function (resolve, reject) {
        console.log(user)
        var u = new User(user)

        u.save().then((newUser) => {
            console.log(newUser)
            resolve(newUser)
        }, (err) => {
            reject(err)
        })
    })
}

exports.authenticate = function (user) {
    return new Promise(function (resolve, reject) {
        console.log("in promise : " + user.username)
        User.findOne({
            username: user.username,
            password: user.password
        }).then((user) => {
            console.log("callback user : " + user)
            resolve(user)
        }, (err) => {
            reject(err)
        })
    })
}

exports.get = function (id) {
    return new Promise(function (resolve, reject) {
        User.findOne({ _id: id }).then((user) => {
            resolve(user)
        }, (err) => {
            reject(err)
        })
    })
}