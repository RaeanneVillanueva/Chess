const socket = io('http://localhost:3000')

const roomContainer = $('#roomContainer')
const readyButton = $("#readyButton")
//in waiting room
if (!roomContainer.length) {
    socket.emit("new-user", room, name)
    readyButton.on("click", function(){
        socket.emit("send-user-ready", room)
    })
}

//in room
if (roomContainer.length) {
    socket.on('room-created', room => {
        /*<div class="room">
                    <div class="room-details">
                        <span class="room-name">{{@key}}</span>

                    </div>
                    <a href="/rooms/{{@key}}" class="join">Join</a>
                </div>*/
        
        roomContainer.append("<div class='room'><div class='room-details'><span class='room-name'>" + room + "</span></div> <a href='/rooms/" + room + "' class='join'>Join</a></div>");
    })
}

socket.once('user-connected', (name) => {
    var p2Name = $("#p2Name")
    p2Name.text(name);
    
})

socket.once('user-ready', data => {
    console.log("USER IS READY ")
})


socket.once('user-disconnected', name => {
    console.log("USER LEEFFT")
})

