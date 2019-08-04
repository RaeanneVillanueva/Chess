const mongoose = require("mongoose")
const hash = require("../js/hash.js")
const salt = require('crypto-random-string');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    salt: String,
    elo: Number,
    wins: Number,
    loses: Number
})

userSchema.pre("save", function (next) {
    this.salt = salt({length: 10, type: 'base64'})
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

exports.authenticate = function (user) {
    return new Promise(function (resolve, reject) {
        console.log("in promise : " + user.username)

        var hashedpw;

        User.findOne({
            username: user.username
        }).then((findUser)=>{
            if(findUser)
                hashedpw = hash(findUser.salt + user.password + findUser.salt)
            
            User.findOne({
                username: user.username,
                password: hashedpw
            }).then((user) => {
                resolve(user)
            }, (err) => {
                reject(err)
            })
        }, (err)=>{
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
