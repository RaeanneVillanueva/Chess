var express = require("express")
const bodyparser = require("body-parser")
const app = express()
var http = require('http').Server(app);
const io = require("socket.io")(http);

const session = require("express-session")
const urlencoder = bodyparser.urlencoded({
    extended: false
})
const cookieparser = require("cookie-parser")
const mongoose = require("mongoose")
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/chessusers", {
    useNewUrlParser: true
})
app.set("view engine", "hbs")
app.use(express.static(__dirname + "/public"));


app.use(session({
    secret: "LOGIN_INFO",
    name: "login",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 2
    }
}))
app.use(cookieparser())
app.use(require("./controllers"))


const users = {};

// io.on('connection', function (socket) {
//     console.log(socket.id + " has connected")

//     socket.on('new-user', (room, name) => {
//         socket.join(room)
//         rooms[room].users[socket.id] = name
//         socket.to(room).broadcast.emit('user-connected', name)
//     })

//     socket.on("send_user_ready", function (data) {
//         socket.to(room).broadcast.emit("user_ready", { message: message, name: rooms[room].users[socket.id] })
//     })

//     socket.on('disconnect', () => {
//         getUserRooms(socket).forEach(room => {
//             socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
//             delete rooms[room].users[socket.id]
//         })
//     })

// })

// function getUserRooms(socket) {
//     return Object.entries(rooms).reduce((names, [name, room]) => {
//         if (room.users[socket.id] != null) names.push(name)
//         return names
//     }, [])
// }

http.listen(3000, function (req, res) {
    console.log("port 3000 is listening...");
})

