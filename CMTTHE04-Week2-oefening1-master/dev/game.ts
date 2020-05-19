class Game {

    fish: Fish
    fish2: Fish
    bubble: Bubble
    jellyfish: Jellyfish

    constructor() {
        console.log("Game was created!")

        this.fish = new Fish()
        this.fish2 = new Fish()
        this.bubble = new Bubble()
        this.jellyfish = new Jellyfish()
        this.gameLoop();


        // const bubblefish = new Fish()
        // bubblefish.draw();

        // for (let i = 0; i < 100; i++) {
        //     new Fish()
        // }
    }
    gameLoop() {
        this.fish.move();
        requestAnimationFrame(() => this.gameLoop())
    }

}

window.addEventListener("load", () => new Game())