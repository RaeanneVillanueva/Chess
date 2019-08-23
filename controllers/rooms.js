const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const User = require("../models/user")
const elo = require("../middleware/elo.js")


const rooms = {}
const games = {}
const urlencoder = bodyparser.urlencoded({
    extended: true
})

router.use(urlencoder)

router.get("/", function (req, res) {
    console.log("GET /rooms")
    if (req.session.username) {
        res.render("rooms", {
            rooms,
            username: req.session.username
        })

    } else {
        res.redirect("/")
    }
})

router.post("/room", urlencoder, function (req, res) {
    console.log("POST /room")
    if (rooms[req.body.room] != null) {
        return res.redirect("/rooms")
    }
    var room = req.body.room.replace("\'", "");

    rooms[room] = { users: {}, ready: 0 }
    req.app.io.emit('room-created', room)
    res.redirect("/rooms/" + room + "/#host")
})

router.get("/:room", function (req, res) {
    console.log("GET /rooms/" + req.params.room)
    if (rooms[req.params.room] == null) {
        return res.redirect("/rooms")
    }
    console.log(rooms)
    var users = rooms[req.params.room].users;
    var p2 = "";
    for (x in users) {
        if (users[x] !== req.session.username) {
            p2 = x
        }
    }
    console.log(users[p2])
    res.render('online-mode', {
        roomName: req.params.room,
        username: req.session.username,
        player1: req.session.username,
        player2: users[p2]
    })



    req.app.io.once('connection', function (socket) {
        socket.on('checkmax', ()=>{
            if(Object.keys(rooms[req.params.room].users).length < 2){
                socket.emit("checkmax", true)
                console.log(true)
            }else{
                socket.emit("checkmax", false)
                console.log(false)
            }
        })

        socket.once('new-user', (room, name) => {
            socket.join(room)
            rooms[room].users[socket.id] = name
            console.log(socket.id + " joined " + room)
            socket.to(room).broadcast.emit('user-connected', name)
        })

        socket.once("send-user-ready", function (room) {
            socket.to(room).broadcast.emit("user-ready")
            rooms[room].ready++;

            if (rooms[room].ready >= 2) {
                socket.to(room).broadcast.emit("start-game", req.params.room)
            }
        })

        socket.once('disconnect', () => {
            getUserRooms(socket).forEach(room => {
                socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
                delete rooms[room].users[socket.id]
                rooms[room].ready = 0;
            })
            for (x in rooms) {
                if (Object.keys(rooms[x].users).length == 0) {
                    socket.broadcast.emit('room-destroyed', x)
                    delete rooms[x]
                }
            }
        })

        socket.on('move', (room, move) => {
            socket.to(room).broadcast.emit("move", move)
        })

        socket.on('gameover', function(name, win){
            User.getByUsername(name).then((user)=>{
                if(win){
                    user.wins++
                }else{
                    user.loses++
                }
                User.edit(user).then(user=>{
                    console.log("Updated wins/losses")
                })
            })
        })
    })
})

router.get('/game/:room', function (req, res) {
    console.log("GET /rooms/game/" + req.params.room)
    if (rooms[req.params.room] == null) {
        return res.redirect("/")
    }
    var users = rooms[req.params.room].users;
    var p2 = "";
    for (x in users) {
        if (users[x] !== req.session.username) {
            p2 = x
        }
    }
    games[req.params.room] = { users }
    res.render("online-mode", {
        username: req.session.username,
        opponent: users[p2],
        room: req.params.room
    })

    req.app.io.once("connection", function (socket) {
        socket.once('new-user', (room, name) => {
            socket.join(room + "game")
            console.log(socket.id + "user joined " + room)
        })
        socket.once("move", (room, move) => {
            socket.to(room).broadcast.emit('oppmove', move)
        })
    })
})




function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[socket.id] != null) names.push(name)
        return names
    }, [])
}

module.exports = router;