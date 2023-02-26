/// <reference path="ball.ts"/>

class Game {

    private ball: Ball
    private paddle: Paddle

    balls: Ball[] = []


    constructor() {
        this.ball = new Ball()
        this.paddle = new Paddle()
        // this.newBalls()
        let hit = this.checkCollision(this.ball.getRectangle(), this.paddle.getRectangle())
        console.log("car 1 hits car 2 ? " + hit)

        this.gameLoop()
    }
    // newBalls() {
    //     for (let i = 0; i < 5; i++) {
    //         this.balls.push(new Ball())

    //     }
    // }



    checkCollision(a: ClientRect, b: ClientRect) {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom)
    }

    private gameLoop() {
        // for (let c of this.balls) {
        //     c.update()}
        let paddleRect = this.paddle.getRectangle()
        let ballRect = this.ball.getFutureRectangle()

        if (this.checkCollision(paddleRect, ballRect)) {
            console.log("de ball komt tegen de paddle")
        } else {
            this.ball.update()
        }


        this.ball.update()
        this.paddle.update()
        requestAnimationFrame(() => this.gameLoop())
    }

}

window.addEventListener("load", () => new Game())