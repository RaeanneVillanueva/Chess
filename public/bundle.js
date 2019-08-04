(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){


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
    $(signupbtn).attr("href", "/user/signup")
    gameplaydiv.appendChild(signupbtn);

    loginbtn = document.createElement("a");
    loginbtn.className = "gameplaybtn hvr-pulse";
    $(loginbtn).text("Log In");
    $(loginbtn).css("cursor", "pointer");
    $(loginbtn).attr("href", "/user/login")
    gameplaydiv.appendChild(loginbtn);

}


module.exports = button;
},{}],2:[function(require,module,exports){
var chessSplashBtn = require('./js/chessSplash.js')

},{"./js/chessSplash.js":1}]},{},[2]);
