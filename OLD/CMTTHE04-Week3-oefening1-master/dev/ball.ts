class Ball {

    private div: HTMLElement
    private x: number = 0
    private y: number = 0
    private xSpeed: number = 1
    private ySpeed: number = 1

    constructor() {
        this.div = document.createElement("ball")

        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this.div)

        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight

        console.log(this.x)
        console.log(this.y)

    }

    getFutureRectangle() {
        let rect = this.div.getBoundingClientRect()
        rect.x += this.xSpeed
        rect.y += this.ySpeed
        return rect
    }

    public getRectangle() {
        return this.div.getBoundingClientRect()
    }

    public update(): void {
        this.x += this.xSpeed
        this.y += this.ySpeed
        this.div.style.transform = `translate(${this.x}px, ${this.y}px)`

        if ((this.x > window.innerWidth) || (this.x < 0)) {
            this.xSpeed *= -1
        }

        if ((this.y > window.innerHeight) || (this.y < 0)) {
            this.ySpeed *= -1
        }

    }
}