# CMTTHE04 Week1 oefening 1

- Opdracht
- Code voorbeelden

## Voorbereiding

Bekijk de code voorbeelden. Download of clone deze repository naar je computer. Open de HTML file in http://localhost.

## Opdracht 1

- Verwijder `<fish>` en `<bubble>` uit de html file
- Vervang `let fish = document.getElementsByTagName("fish")[0]` in de javascript file door:
```
let fish = document.createElement("fish")
document.body.appendChild(fish)
```

- Doe nu ditzelfde voor het bubble element.
- Plaats je code in een functie.

## Opdracht 2

In deze regels code staan de coördinaten en de kleur van de vis: 
```
fish.style.transform = "translate(200px, 100px)"
fish.style.filter = "hue-rotate(200deg)"
```

- Vervang de x en y waarden van de vis en bubble door willekeurige waarden.
- Geef de vis een willekeurige kleur (hue-rotate) tussen 0 en 360
- Zorg dat de vis en bubble wel altijd binnen beeld blijven

## Opdracht 3

- Maak een for loop die 100 (of meer?) visjes en bubbles toevoegt. 

## Extra uitdaging

- Voeg een click event listener toe aan elk visje en bubble. 
- Als geklikt wordt op de vis geef je de geklikte vis de CSS class "deadfish" door `element.classList.add("deadfish")` te gebruiken.
- Als geklikt wordt op de bubble verwijder je het element met `element.remove()`


# Code voorbeelden week 1

Semantische HTML elementen
```
<road>
    <car></car>
    <car></car>
</road>
```

CSS voor semantische elementen
```
car {
   display: block;
   position:absolute;
   width:100px; height:100px;
   background-image: url(car.png);
}
```
Aanmaken elementen met javascript
```
let c = document.createElement("car")
document.body.appendChild(c)
```
Positioneren  elementen met javascript
```
c.style.transform = "translate(20px, 20px)"

let posx = 100
let posy = 300
c.style.transform = `translate(${posx}px, ${posy}px)`
```
Random getal tussen 0 en afmeting window
```
let randomPosition = Math.random() * window.innerWidth
```
Een element klikbaar maken:
```
element.addEventListener("click", clickMe)

function clickMe(e){
    console.log("you clicked on " + e.target)
}
```