import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

const csvFile = "./data/mushrooms.csv"
const trainingLabel = "class"
const ignoredColumns = ['']

let trainData 
let testData

let totalAmount
let correctAmount = 0
let decisionTree

let PeAedible = 0
let PeApoisonous = 0
let PpAedible = 0
let PpApoisonous = 0

// inladen csv data
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
            trainData = results.data.slice(0, Math.floor(results.data.length * 0.8))
            testData = results.data.slice(Math.floor(results.data.length * 0.8) + 1)
            totalAmount = testData.length

            trainModel()
        }
    })
}

// MACHINE LEARNING - Bouw de Decision Tree
function trainModel() {
    decisionTree = new DecisionTree({
        ignoredAttributes: ignoredColumns,
        trainingSet: trainData,
        categoryAttr: trainingLabel
    })

    let json = decisionTree.toJSON()
 // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, json)

    testData.forEach(element => {
        testMushroom(element)
    });
    
    // accuracy weergeven 
    document.getElementsByTagName("p")[0].innerHTML += correctAmount / totalAmount * 100 + "%"
    
    // invulling voor de matrix
    document.getElementsByTagName("td")[4].innerHTML = PeAedible
    document.getElementsByTagName("td")[5].innerHTML = PpAedible
    document.getElementsByTagName("td")[7].innerHTML = PeApoisonous
    document.getElementsByTagName("td")[8].innerHTML = PpApoisonous

}

// prediction maken
function testMushroom(mushroom){
    const mushroomWithoutLabel = Object.assign({}, mushroom)
    delete mushroomWithoutLabel.class

    let prediction = decisionTree.predict(mushroomWithoutLabel)

    if(prediction == 'e'){
    
        if (prediction == mushroom.class) {
            correctAmount++
            PeAedible++
        }else{
            PeApoisonous++
        }
    }

    if(prediction == 'p'){

        if (prediction == mushroom.class) {
            correctAmount++
            PpApoisonous++
        }else{
            PpAedible++
        }
    }
}
loadData()
