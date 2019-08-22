const mongoose = require("mongoose")
const hash = require("../middleware/hash.js")
const salt = require('crypto-random-string');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 4
    },
    password: {
        type: String,
        required: true
    },
    salt: String,
    elo: Number,
    wins: Number,
    loses: Number
})

userSchema.pre("save", function (next) {
    this.salt = salt({ length: 10, type: 'base64' })
    this.password = hash(this.salt + this.password + this.salt)
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

exports.edit = function(user){
    //edits a user's credentials
}

exports.delete = function(id){
    //deletes a user (not sure if needed)
}

exports.authenticate = function (user) {
    return new Promise(function (resolve, reject) {
        var hashedpw;
        User.findOne({
            username: user.username,
        }).exec((err, foundUser) => {
            if (err) reject(err)
            else if (!foundUser || foundUser == null) {
                reject(new Error("User not found"))
            } else {
                var salt = foundUser.salt
                var userpass = user.password
                var hashedpw = hash(salt + userpass + salt)
                if (hashedpw == foundUser.password) resolve(foundUser)
                else reject(new Error("Incorrect password"))
            }
        })


        // var salt = getSalt(user.username)
        // console.log("HASHED:")
        // var hashedpw = hash(salt + user.password + salt)
        // User.getByUsername({
        //     username: user.username,
        //     password: hashedpw
        // }).then((foundUser) => {
        //     console.log("FOUND: " + foundUser)
        //     resolve(foundUser)
        // }, (err) => {
        //     reject(err)
        // })
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


exports.getByUsername = function (username) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            username: username
        }).then((user) => {
            resolve(user)
        }, (err) => {
            reject(err)
        })
    })
}