class Fish {

    div: HTMLElement
    fish: Fish
    posx: number = 0
    posy: number = 0
    color: number


    constructor() {
        this.div = document.createElement("fish")
        this.div.addEventListener("click", () => this.killFish())

        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this.div)
        this.posx = Math.random() * (window.innerWidth - this.div.clientWidth)
        this.posy = Math.random() * (window.innerHeight - this.div.clientHeight)
        this.div.style.transform = `translate(${this.posx}px, ${this.posy}px)`

        this.changeColor()
    }

    changeColor() {
        this.color = Math.random() * 360
        this.div.style.filter = `hue-rotate(${this.color}deg)`
    }

    move() {
        this.posx += 3
        this.posy += 1

        this.div.style.transform = `translate (${this.posx}px, ${this.posy}px)`
    }

    killFish() {
        // console.log(this.div)
        this.div.classList.add("dead")
    }
}

