$(document).ready(function(){
    let gameplaydiv, singlebtn, multibtn, borderdiv, chessboard;

    $("#playbtn").click(function(){
        $(this).slideUp();
        gameplaybtns();
    })

    $(document).on("click", ".gameplaybtn", function(){
        $("#borderdiv").empty().slideUp();

        borderdiv = document.createElement("div");
        borderdiv.className = "border";
        $("body").append(borderdiv);

        chessboard = document.createElement("div");
        chessboard.className = "chessboard animated fadeIn"
        $(chessboard).attr("id", "chessboard");
        $(borderdiv).append(chessboard);
        createChessboard();
    })



    function gameplaybtns(){
        gameplaydiv = document.createElement("div");
        gameplaydiv.className = "gameplaydiv";
        $("#borderdiv").append(gameplaydiv);

        singlebtn = document.createElement("a");
        singlebtn.className = "gameplaybtn hvr-pulse"
        $(singlebtn).text("Single Player");
        $(singlebtn).css("cursor", "pointer");
        gameplaydiv.appendChild(singlebtn);

        multibtn = document.createElement("a");
        multibtn.className = "gameplaybtn hvr-pulse"
        $(multibtn).text("Multiplayer");
        $(multibtn).css("cursor", "pointer");
        gameplaydiv.appendChild(multibtn);
    }

    function createChessboard(){
        var config = {
            position: "start",
            draggable: true
        }
        
        let board = Chessboard("chessboard", config);
    }
})