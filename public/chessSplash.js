

var button = $("#playbtn").click(function () {
    $(this).slideUp();
    gameplaybtns();
})


function gameplaybtns() {
    let gameplaydiv, signupbtn,loginbtn;
    gameplaydiv = document.createElement("div");
    gameplaydiv.className = "gameplaydiv";
    $("#borderdiv").append(gameplaydiv);

    signupbtn = document.createElement("a");
    signupbtn.className = "gameplaybtn hvr-pulse";
    $(signupbtn).text("Sign Up!");
    $(signupbtn).css("cursor", "pointer");
    gameplaydiv.appendChild(signupbtn);

    loginbtn = document.createElement("a");
    loginbtn.className = "gameplaybtn hvr-pulse";
    $(loginbtn).text("Log In");
    $(loginbtn).css("cursor", "pointer");
    gameplaydiv.appendChild(loginbtn);
}


module.exports = button;