$(document).ready(function(){
    let gameplaydiv, singlebtn, multibtn;

    $("#playbtn").click(function(){
        $(this).slideUp();
        gameplaybtns();
    })

    $(document).on("click", ".gameplaybtn", function(){
        $("#borderdiv").empty().slideUp();
        $("body").css({"background": "#e7e1d4"});
    })



    function gameplaybtns(){
        gameplaydiv = document.createElement("div");
        gameplaydiv.className = "gameplaydiv";
        $("#borderdiv").append(gameplaydiv);

        singlebtn = document.createElement("a");
        singlebtn.className = "gameplaybtn animated fadeInUp hvr-sweep-to-right"
        $(singlebtn).text("Single Player");
        $(singlebtn).css("cursor", "pointer");
        gameplaydiv.appendChild(singlebtn);

        multibtn = document.createElement("a");
        multibtn.className = "gameplaybtn animated fadeInUp hvr-sweep-to-right"
        $(multibtn).text("Multiplayer");
        $(multibtn).css("cursor", "pointer");
        gameplaydiv.appendChild(multibtn);
    }
})