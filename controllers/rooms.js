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

    rooms[req.body.room] = { users: {} }
    req.app.io.emit('room-created', req.body.room)
    res.redirect("/rooms/" + req.body.room)


})

router.get("/:room", function (req, res) {
    if (rooms[req.params.room] == null) {
        return res.redirect("/rooms")
    }
   

    res.render('waiting-room', { roomName: req.params.room, username: req.session.username})

    
    req.app.io.once('connection', function (socket) {
        socket.once('new-user', (room, name) => {
            socket.join(room)
            rooms[room].users[socket.id] = name
            socket.to(room).broadcast.emit('user-connected', name)
        })

        socket.once("send-user-ready", function (room) {
            socket.to(room).broadcast.emit("user-ready")
        })

        socket.once('disconnect', () => {
            getUserRooms(socket).forEach(room => {
                socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
                delete rooms[room].users[socket.id]
            })
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