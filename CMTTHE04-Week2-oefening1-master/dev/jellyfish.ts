class Jellyfish {

    div: HTMLElement
    jellyfish: Jellyfish
    x: number = 0
    y: number = 0


    constructor() {
        this.div = document.createElement("jellyfish")


        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this.div)
        // this.draw()

        // this.div.addEventListener("click", () => this.killjellyfish())

        let posx = Math.random() * window.innerWidth - this.div.clientWidth
        let posy = Math.random() * window.innerHeight - this.div.clientHeight
        this.div.style.transform = `translate(${posx}px, ${posy}px)`

        this.changeColor()
    }

    changeColor() {
        let color = Math.random() * 360
        this.div.style.filter = `hue-rotate(${color}deg)`
    }

    move() {
        this.x += 3
        this.y += 1

        this.div.style.transform = `translate (${this.x}px, ${this.y}px)`
    }

}