const socket = io('http://localhost:3000')

socket.emit('new_user', /*name of user*/)

socket.on('room-created', room => {
    //create a room with stuff and all
})

socket.on('user-connected', name => {
    //change the div to username
})

socket.on('user-disconnected', name => {
    //remove the div
})
