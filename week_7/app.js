import { createChart, updateChart } from "./scatterplot.js";

// Get DOM elements
const predictButton = document.getElementById("btn");
const saveButton = document.getElementById("save");
const resultDiv = document.getElementById("result");

// Event listener
predictButton.addEventListener("click", (e) => {
  // document.getElementById("field").value
  e.preventDefault();
  makePrediction(
    +document.getElementById("field").value,
    +document.getElementById("field1").value
  );
});

saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  nn.save();
});

const nn = ml5.neuralNetwork({ task: "regression", debug: true });

// Load CSV
function loadData() {
  Papa.parse("./data/cars.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => createNeuralNetwork(results.data),
  });
}

// Create neural network
function createNeuralNetwork(data) {
  // Shuffle
  data.sort(() => Math.random() - 0.5);
  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  let testData = data.slice(Math.floor(data.length * 0.8) + 1);

  // Add data to neural network
  for (let car of trainData) {
    nn.addData(
      { horsepower: car.horsepower, cylinders: car.cylinders },
      { mpg: car.mpg }
    );
  }

  // Normalize
  nn.normalizeData();
  plotData(data, testData);
}

function plotData(data, testData) {
  console.log(testData);
  const chartData = data
    .filter((car) => car.mpg != null && car.horsepower != null)
    .map((car) => ({
      x: car.mpg,
      y: car.horsepower,
    }));

  console.log(chartData);
  startTraining(data, testData);
  createChart(chartData, "horsepower", "mpg");
}

// Train neural network
function startTraining(data, testData) {
  console.log(testData);
  nn.train({ epochs: 12 }, () => finishedTraining(data, testData));
}

async function finishedTraining(data, testData) {
  let predictions = [];
  for (const car of testData) {
    let pred = await nn.predict({
      horsepower: car.horsepower,
      cylinders: car.cylinders,
    });
    predictions.push({ y: car.horsepower, x: pred[0].mpg });
  }
  updateChart("Predictions", predictions);
}
// Make prediction
async function makePrediction(horsepower, cylinders) {
  const results = await nn.predict({
    horsepower: horsepower,
    cylinders: cylinders,
  });
  resultDiv.innerText = `Estimated usage: ${results[0].mpg}`;
}

loadData();
