
let nn
const featureExtractor = ml5.imageClassifier('model/model.json', modelLoaded);
let prediction, prediction2;
const image = document.getElementById('img')
const fileButton = document.querySelector("#file")
let synth = window.speechSynthesis;


image.addEventListener('load', () => Predict())

function modelLoaded() {
    console.log('Model Loaded!');
}

function Predict() {
    document.getElementById("empty").style.display = "none";
  prediction = document.getElementById('prediction');
  prediction2 = document.getElementById('secondary-results');
  console.log('stap 1')

  featureExtractor.classify(document.getElementById('img'), (err, results) => {
    console.log(results);
    prediction.innerHTML = `Ik denk dat dit ${results[0].label} is voor ${results[0].confidence.toFixed(2) * 100}%.`;
    prediction2.innerHTML = `Het zou ook zomaar ${results[1].label} kunnen zijn, maar ik weet het niet zeker.`
    console.log('stap 2')

    speak(prediction.innerHTML);
    console.log('stap 3')
  });
}

function speak(message) {
    console.log(message);
  if (synth.speaking) {
    return;
  }
  if (message !== '') {
    let utterThis = new SpeechSynthesisUtterance(message);
    synth.speak(utterThis);
  }
}

fileButton.addEventListener("change", (event)=>loadFile(event))

function loadFile(event) {
	image.src = URL.createObjectURL(event.target.files[0])
}
