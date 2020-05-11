//
// vis element
//
// let posx = Math.random() * window.innerWidth
// let posy = Math.random() * window.innerHeight
// let color = Math.random() * 360
// let posxBubble = Math.random() * window.innerWidth
// let posyBubble = Math.random() * window.innerHeight

function addFish() {
    let fish = document.createElement("fish")
    let posx = Math.random() * window.innerWidth
    let posy = Math.random() * window.innerHeight
    let color = Math.random() * 360
    document.body.appendChild(fish)
    fish.style.transform = `translate(${posx}px, ${posy}px)`
    fish.style.filter = `hue-rotate(${color}deg)`
}

function addBubble() {
    let bubble = document.createElement("bubble")
    let posxBubble = Math.random() * window.innerWidth
    let posyBubble = Math.random() * window.innerHeight
    document.body.appendChild(bubble)
    bubble.style.transform = `translate(${posxBubble}px, ${posyBubble}px)`

}


for (let i = 0; i < 100; i++) {
    addFish()
    addBubble()
}


// bubble.addEventListener("click", removeBubble())

// function removeBubble() {
//     `bubble.remove()`
// }