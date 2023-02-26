// class Bubble {

//     div: HTMLElement

//     constructor() {
//         this.div = document.createElement("bubble")
//         document.body.appendChild(this.div)

//         this.div.addEventListener("click", () => this.popBubble())

//         this.popBubble()
//     }






// addBubble() {
//     let bubble = document.createElement("bubble")
//     bubble.addEventListener("click", onBubbleClick)
//     Game.appendChild(bubble)

//     let posxBubble = Math.random() * window.innerWidth - bubble.clientWidth
//     let posyBubble = Math.random() * window.innerHeight - bubble.clientHeight
//     bubble.style.transform = `translate(${posxBubble}px, ${posyBubble}px)`

// }
// }


class Bubble {

    div: HTMLElement
    bubble: Bubble
    x: number = 0
    y: number = 0


    constructor() {
        this.div = document.createElement("bubble")
        this.div.addEventListener("click", () => this.popBubble())

        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this.div)
        // this.draw()

        // this.div.addEventListener("click", () => this.killFish())

        let posx = Math.random() * window.innerWidth - this.div.clientWidth
        let posy = Math.random() * window.innerHeight - this.div.clientHeight
        this.div.style.transform = `translate(${posx}px, ${posy}px)`


    }

    popBubble() {
        // console.log("Plop!")
        this.div.remove()
    }

    move() {
        this.x += 3
        this.y += 1

        this.div.style.transform = `translate (${this.x}px, ${this.y}px)`
    }
}
