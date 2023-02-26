//
// vis element
//
// let posx = Math.random() * window.innerWidth
// let posy = Math.random() * window.innerHeight
// let color = Math.random() * 360
// let posxBubble = Math.random() * window.innerWidth
// let posyBubble = Math.random() * window.innerHeight


let game = document.getElementsByTagName("game")[0]

for (let i = 0; i < 100; i++) {
    addFish()
    addBubble()
}


function addFish() {
    let fish = document.createElement("fish")
    fish.addEventListener("click", onFishClick)
    game.appendChild(fish)

    let posx = Math.random() * window.innerWidth - fish.clientWidth
    let posy = Math.random() * window.innerHeight - fish.clientHeight
    let color = Math.random() * 360
    fish.style.transform = `translate(${posx}px, ${posy}px)`
    fish.style.filter = `hue-rotate(${color}deg)`
}

function addBubble() {
    let bubble = document.createElement("bubble")
    bubble.addEventListener("click", onBubbleClick)
    game.appendChild(bubble)

    let posxBubble = Math.random() * window.innerWidth - bubble.clientWidth
    let posyBubble = Math.random() * window.innerHeight - bubble.clientHeight
    bubble.style.transform = `translate(${posxBubble}px, ${posyBubble}px)`

}

function onFishClick(event) {
    event.target.classList.add("dead")
}

function onBubbleClick(event) {
    event.target.remove()
}



// bubble.addEventListener("click", removeBubble())

// function removeBubble() {
//     `bubble.remove()`
// }