"use strict";
var Ball = (function () {
    function Ball() {
        this.x = 0;
        this.y = 0;
        this.xSpeed = 1;
        this.ySpeed = 1;
        this.div = document.createElement("ball");
        var game = document.getElementsByTagName("game")[0];
        game.appendChild(this.div);
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        console.log(this.x);
        console.log(this.y);
    }
    Ball.prototype.getFutureRectangle = function () {
        var rect = this.div.getBoundingClientRect();
        rect.x += this.xSpeed;
        rect.y += this.ySpeed;
        return rect;
    };
    Ball.prototype.getRectangle = function () {
        return this.div.getBoundingClientRect();
    };
    Ball.prototype.update = function () {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
        if ((this.x > window.innerWidth) || (this.x < 0)) {
            this.xSpeed *= -1;
        }
        if ((this.y > window.innerHeight) || (this.y < 0)) {
            this.ySpeed *= -1;
        }
    };
    return Ball;
}());
var Game = (function () {
    function Game() {
        this.balls = [];
        this.ball = new Ball();
        this.paddle = new Paddle();
        var hit = this.checkCollision(this.ball.getRectangle(), this.paddle.getRectangle());
        console.log("car 1 hits car 2 ? " + hit);
        this.gameLoop();
    }
    Game.prototype.checkCollision = function (a, b) {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        var paddleRect = this.paddle.getRectangle();
        var ballRect = this.ball.getFutureRectangle();
        if (this.checkCollision(paddleRect, ballRect)) {
            console.log("de ball komt tegen de paddle");
        }
        else {
            this.ball.update();
        }
        this.ball.update();
        this.paddle.update();
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    return Game;
}());
window.addEventListener("load", function () { return new Game(); });
var Paddle = (function () {
    function Paddle() {
        var _this = this;
        this.downSpeed = 0;
        this.upSpeed = 0;
        this.div = document.createElement("paddle");
        var game = document.getElementsByTagName("game")[0];
        game.appendChild(this.div);
        this.upkey = 87;
        this.downkey = 83;
        this.x = 0;
        this.y = 200;
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
    }
    Paddle.prototype.getRectangle = function () {
        return this.div.getBoundingClientRect();
    };
    Paddle.prototype.onKeyDown = function (e) {
        console.log(e.keyCode);
        switch (e.keyCode) {
            case this.upkey:
                this.upSpeed = 10;
                break;
            case this.downkey:
                this.downSpeed = 10;
                break;
        }
    };
    Paddle.prototype.onKeyUp = function (e) {
        switch (e.keyCode) {
            case this.upkey:
                this.upSpeed = 0;
                break;
            case this.downkey:
                this.downSpeed = 0;
                break;
        }
    };
    Paddle.prototype.update = function () {
        var newY = this.y - this.upSpeed + this.downSpeed;
        if (newY > 0 && newY + 100 < window.innerHeight)
            this.y = newY;
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    return Paddle;
}());
//# sourceMappingURL=main.js.map