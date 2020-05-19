class Fish {

    div: HTMLElement
    fish: Fish
    x: number = 0
    y: number = 0


    constructor() {
        this.div = document.createElement("fish")
        this.div.addEventListener("click", () => this.killFish())

        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this.div)
        // this.draw()

        // this.div.addEventListener("click", () => this.killFish())

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


    // draw() {
    //         let posx = Math.random() * window.innerWidth
    // let posy = Math.random() * window.innerHeight
    //     let color = Math.random() * 360
    //     this.div.style.transform = `translate(${posx}px, ${posy}px)`
    //     this.div.style.filter = `hue-rotate(${color}deg)`
    //     console.log('newfish')
    // }

    killFish() {
        // console.log(this.div)
        this.div.classList.add("dead")
    }
}

//     constructor() {
//         console.log("Fish was created!")

//         this.killFish()
//     }

//     killFish() {
//         console.log("Aargh!")
//     }

//     addFish() {
//         let fish = document.createElement("fish")
//         fish.addEventListener("click", onFishClick)
//         game.appendChild(fish)

//         let posx = Math.random() * window.innerWidth - fish.clientWidth
//         let posy = Math.random() * window.innerHeight - fish.clientHeight
//         let color = Math.random() * 360
//         fish.style.transform = `translate(${posx}px, ${posy}px)`
//         fish.style.filter = `hue-rotate(${color}deg)`
//     }
// }


