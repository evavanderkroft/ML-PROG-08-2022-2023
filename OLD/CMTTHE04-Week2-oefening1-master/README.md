# CMTTHE04 Week 2

Pixel Aquarium Typescript

## Voorbereiding

- Installeer Visual Studio Code en Typescript (lees de quickstart guide)
- Bekijk de bestanden van dit project
- Druk op CMD + SHIFT + B en kies voor `watch mode`
- Kijk of de `main.js` file in de `docs/js` map is aangemaakt.
- Open `index.html` via localhost

## Opdracht

- Open de oefening van week 1
- Verplaats de code die één Vis en één Bubble tekent naar de juiste plek in dit project
- maak in game.ts een nieuw vis aan
```
let fish : Fish = new Fish()
```
- De vis heeft een random kleur en positie
- De bubble heeft een random positie

## Opdracht

- Voeg een nieuw zelfbedacht element toe aan het aquarium. Maak een nieuwe class file en zorg dat je nieuwe element in `game.ts` wordt toegevoegd aan de game.

## Opdracht

- Geef de vis een click handler die op zijn element de CSS class "dead" toevoegt. Dit kan je doen met `element.classList.add("dead")`
- Geef de bubble een click handler die het html element weghaalt. Dit kan je doen met `element.remove()`

# Code voorbeeld

In deze class maken we het HTML element een property van de class. Dit is handig omdat we dan later via `this.div` het element weer kunnen gebruiken. Ook zie je hoe je een click handler kan gebruiken in een class.

```
class Fish {

    div: HTMLElement
    
    constructor() {
        this.div = document.createElement("fish")
        document.body.appendChild(this.div)
        
        this.div.addEventListener("click", () => this.killFish())
    }

    killFish(){
        console.log(this.div)
    }
}
```