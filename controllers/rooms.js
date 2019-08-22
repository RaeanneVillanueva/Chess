const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const User = require("../models/user")


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

    rooms[req.body.room] = { users: {}, ready: 0 }
    req.app.io.emit('room-created', req.body.room)
    res.redirect("/rooms/" + req.body.room + "/#host")
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

    res.render('waiting-room', {roomName: req.params.room,
                                username: req.session.username,
                                player1: req.session.username,
                                player2: users[p2]})
   


    req.app.io.once('connection', function (socket) {
        socket.once('new-user', (room, name) => {
            socket.join(room)
            rooms[room].users[socket.id] = name
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
    })
})

router.get('/game/:room', function (req, res){
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
    games[req.params.room] = {users}
    res.render("online-mode", {
        username: req.session.username,
        opponent: users[p2]
    })

    req.app.io.once("connection", function(socket){
        console.log("User connected")
        socket.once("move", move =>{
            console.log("MOVEdd")
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