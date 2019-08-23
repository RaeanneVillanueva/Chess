const socket = io('http://localhost:3000')
const roomContainer = $('#roomContainer')
const readyButton = $("#readyButton")
//in waiting room
console.log(roomContainer.length)

if (!roomContainer.length) {
    socket.emit("checkmax")

    socket.on("checkmax", allowed=>{
        if(!allowed){
            alert("Full!")
            window.location.href = "/rooms"
        }
    })
    socket.emit("new-user", room, name)
    
    console.log(location.hash === "#host")
    if(location.hash === "#host"){
        $(".ready-player1").show()
        $(".ready-player1").text("HOST")
        readyButton.text("Opponent not ready")
        readyButton.attr("disabled", true)
        readyButton.on("click", function(){
            socket.emit("send-user-ready", room)
            gameStart()
        })
    }else{
        $(".ready-player2").show()
        $(".ready-player2").text("HOST")
        readyButton.on("click", function(){
            readyButton.attr("disabled", true)
            $(".ready-player1").show()
            socket.emit("send-user-ready", room)
        })
    }
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

socket.on('user-ready', () => {
    console.log("opponent ready")
    $(".ready-player2").show()
    readyButton.text("Start")
    readyButton.attr("disabled", false)
})

socket.on('room-destroyed', room =>{
    console.log("DESTROYED ROOM " + room)
    $("div." + room ).remove()
})

socket.once('user-disconnected', name => {
    console.log("USER LEEFFT")
    $("#p2Name").text("");
    readyButton.attr("disabled", false)
    $(".ready-player2").hide()

})

socket.once("start-game", (room)=>{
    gameStart()
    // socket.emit("send-user-ready", room)
    // window.location.href = "/rooms/game/" + room
})

function gameStart(){
    console.log("GAME START");
    $("#tools").show()
    $("#onlinechessboard").show()
    $("#prepare").hide()
    $(".ready-player1").hide()
    $(".ready-player2").hide()
}