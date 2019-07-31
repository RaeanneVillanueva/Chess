

var button = $("#playbtn")

button.click(function () {
    $(this).slideUp();
    gameplaybtns();
})
function gameplaybtns() {
    gameplaydiv = document.createElement("div");
    gameplaydiv.className = "gameplaydiv";
    $("#borderdiv").append(gameplaydiv);

    singlebtn = document.createElement("a");
    singlebtn.className = "gameplaybtn animated fadeInUp hvr-sweep-to-right";
    $(singlebtn).text("Sign Up!");
    $(singlebtn).css("cursor", "pointer");
    gameplaydiv.appendChild(signupbtn);

    multibtn = document.createElement("a");
    multibtn.className = "gameplaybtn animated fadeInUp hvr-sweep-to-right";
    $(multibtn).text("Log In");
    $(multibtn).css("cursor", "pointer");
    gameplaydiv.appendChild(loginbtn);
}


module.exports = button;