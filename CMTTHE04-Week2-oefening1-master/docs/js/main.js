"use strict";
var Bubble = (function () {
    function Bubble() {
        var _this = this;
        this.x = 0;
        this.y = 0;
        this.div = document.createElement("bubble");
        this.div.addEventListener("click", function () { return _this.popBubble(); });
        var game = document.getElementsByTagName("game")[0];
        game.appendChild(this.div);
        var posx = Math.random() * window.innerWidth - this.div.clientWidth;
        var posy = Math.random() * window.innerHeight - this.div.clientHeight;
        this.div.style.transform = "translate(" + posx + "px, " + posy + "px)";
    }
    Bubble.prototype.popBubble = function () {
        this.div.remove();
    };
    Bubble.prototype.move = function () {
        this.x += 3;
        this.y += 1;
        this.div.style.transform = "translate (" + this.x + "px, " + this.y + "px)";
    };
    return Bubble;
}());
var Fish = (function () {
    function Fish() {
        var _this = this;
        this.x = 0;
        this.y = 0;
        this.div = document.createElement("fish");
        this.div.addEventListener("click", function () { return _this.killFish(); });
        var game = document.getElementsByTagName("game")[0];
        game.appendChild(this.div);
        var posx = Math.random() * window.innerWidth - this.div.clientWidth;
        var posy = Math.random() * window.innerHeight - this.div.clientHeight;
        this.div.style.transform = "translate(" + posx + "px, " + posy + "px)";
        this.changeColor();
    }
    Fish.prototype.changeColor = function () {
        var color = Math.random() * 360;
        this.div.style.filter = "hue-rotate(" + color + "deg)";
    };
    Fish.prototype.move = function () {
        this.x += 3;
        this.y += 1;
        this.div.style.transform = "translate (" + this.x + "px, " + this.y + "px)";
    };
    Fish.prototype.killFish = function () {
        this.div.classList.add("dead");
    };
    return Fish;
}());
var Game = (function () {
    function Game() {
        console.log("Game was created!");
        this.fish = new Fish();
        this.fish2 = new Fish();
        this.bubble = new Bubble();
        this.jellyfish = new Jellyfish();
        this.gameLoop();
    }
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.fish.move();
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    return Game;
}());
window.addEventListener("load", function () { return new Game(); });
var Jellyfish = (function () {
    function Jellyfish() {
        this.x = 0;
        this.y = 0;
        this.div = document.createElement("jellyfish");
        var game = document.getElementsByTagName("game")[0];
        game.appendChild(this.div);
        var posx = Math.random() * window.innerWidth - this.div.clientWidth;
        var posy = Math.random() * window.innerHeight - this.div.clientHeight;
        this.div.style.transform = "translate(" + posx + "px, " + posy + "px)";
        this.changeColor();
    }
    Jellyfish.prototype.changeColor = function () {
        var color = Math.random() * 360;
        this.div.style.filter = "hue-rotate(" + color + "deg)";
    };
    Jellyfish.prototype.move = function () {
        this.x += 3;
        this.y += 1;
        this.div.style.transform = "translate (" + this.x + "px, " + this.y + "px)";
    };
    return Jellyfish;
}());
//# sourceMappingURL=main.js.map