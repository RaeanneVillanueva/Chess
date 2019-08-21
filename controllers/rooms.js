const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")


const rooms = {}
const urlencoder = bodyparser.urlencoded({
    extended: true
})

router.use(urlencoder)

router.get("/", function (req, res) {
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
    if (rooms[req.body.room] != null) {
        return res.redirect("/rooms")
    }

    rooms[req.body.room] = { users: {}, ready: 0 }
    req.app.io.emit('room-created', req.body.room)
    res.redirect("/rooms/" + req.body.room)



})

router.get("/:room", function (req, res) {
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

    res.render('waiting-room', { roomName: req.params.room, username: req.session.username, player1: req.session.username, player2: users[p2] })


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
                socket.to(room).broadcast.emit("start-game")
            }
        })

        socket.once('disconnect', () => {
            getUserRooms(socket).forEach(room => {
                socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
                delete rooms[room].users[socket.id]
                rooms[room].ready = 0;
            })
            for (x in rooms) {
                console.log(Object.keys(rooms[x].users).length)
                if (Object.keys(rooms[x].users).length) {
                    socket.broadcast.emit('room-destroyed', rooms[x])
                    delete rooms[x]
                }
            }
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