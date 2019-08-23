const mongoose = require("mongoose")
const hash = require("../middleware/hash.js")
const salt = require('crypto-random-string');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true,"Username is required"],
        minlength: [4, "At least 4 characters required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    salt: String,
    elo: Number,
    wins: Number,
    loses: Number,
    draws: Number,
    dateCreated: Date
})

userSchema.pre("save", function (next) {
    this.salt = salt({ length: 10, type: 'base64' })
    this.password = hash(this.salt + this.password + this.salt)
    this.elo = 1200
    this.wins = 0
    this.loses = 0
    this.draws = 0
    this.date = new Date()
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
            if(err && err.code === 11000) reject(new Error("Username already taken"))
            else reject(err)
        })
    })
}

exports.editByUsername = function (newUser) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({
            username: newUser.username
        }, {
                $set: {
                    username: newUser.username,
                    password: newUser.password,
                    elo: newUser.elo,
                    wins: newUser.wins,
                    loses: newUser.loses,
                    draws: newUser.draws
                }
            }, {
                new: true
            }).then((updatedUser) => {
                resolve(updatedUser)
            }, (err) => {
                reject(err)
            })
    })
}

exports.edit = function (id, newUser) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({
            _id: id
        }, {
                $set: {
                    username: newUser.username,
                    elo: newUser.elo,
                    wins: newUser.wins,
                    loses: newUser.loses,
                    draws: newUser.draws
                }
            }, {
                new: true
            }).then((updatedUser) => {
                resolve(updatedUser)
            }, (err) => {
                reject(err)
            })
    })
}

exports.delete = function (id) {
    //deletes a user
    return new Promise(function (resolve, reject) {
        User.deleteOne({
            _id:id
        },function(err, doc){
            if(err) console.log(err)
            else resolve(doc)
        })
    })
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

exports.getElo = function (username) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            username: username
        }).then((user) => {
            resolve(user.elo)
        }, (err) => {
            reject(err)
        })
    })
}

exports.getAll = function(){
    return new Promise(function (resolve, reject){
        User.find({
            //all
        }).then((users)=>{
            resolve(users)
        }, (err)=>{
            reject(err)
        })
    })
}