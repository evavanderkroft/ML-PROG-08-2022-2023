// // More API functions here:
// // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// // the link to your model provided by Teachable Machine export panel
// const URL = "./my_model/";

// let model, webcam, labelContainer, maxPredictions;

// let div = document.createElement("div");
// let predictionContainer = document.getElementById("prediction-container");
// let count = 0;

// // Load the image model and setup the webcam
const startButton = document.getElementById("button-start")
startButton.addEventListener("click", init)

init()

async function init() {
  // const modelURL = URL + "model.json";
  // const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // // append elements to the DOM
  // document.getElementById("webcam-container").appendChild(webcam.canvas);
  // labelContainer = document.getElementById("label-container");
  // for (let i = 0; i < maxPredictions; i++) {
  //   // and class labels
  //   labelContainer.appendChild(document.createElement("div"));
  // }
}

// async function uploadModel() {
//   const modelURL = URL + "model.json";
//   model = await tmImage.load(modelURL, metadataURL);
//   const URL = "./my_model_Traindata/";
// }
// async function loop() {
//   webcam.update(); // update the webcam frame
//   let predictionResult = await predict();
//   window.requestAnimationFrame(loop);

//   if (predictionResult >= 0.8) {
//     count++;
//     console.log("doet het ily");
//   }

//   if (count > 200) {
//     console.log("doet het nogmaals ily");
//     window.location.href = "rightMovement2.html";
//   }
// }

// // run the webcam image through the image model
// async function predict() {
//   // predict can take in an image, video or canvas html element
//   const prediction = await model.predict(webcam.canvas);
//   for (let i = 0; i < maxPredictions; i++) {
//     const classPrediction =
//       prediction[i].className + ": " + prediction[i].probability.toFixed(2);
//     labelContainer.childNodes[i].innerHTML = classPrediction;
//   }

//   return prediction[0].probability;
// }

let model;
let videoWidth, videoHeight;
let ctx, canvas;
const log = document.querySelector("#array");
const VIDEO_WIDTH = 720;
const VIDEO_HEIGHT = 405;

import kNear from "../src/knear.js";

let data;
const knn = new kNear(3);

// video fallback
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

// array posities van de vingerkootjes
let fingerLookupIndices = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

//
// start de applicatie
//

async function main() {
  model = await handpose.load({
    modelPath: "../src/model.json",
    metadataPath: "../src/metadata.json",
    weightsPath: "../src/weights.bin",
  });

  const video = await setupCamera();
  video.play();
  startLandmarkDetection(video);
}

function classify() {
  let prediction = knn.classify(data.split`,`.map((x) => +x));
  predictionTxt.innerHTML = prediction;
  console.log(prediction);
}

// async function posemodel() {
//   const handposeModel = await tf.loadGraphModel(
//     "/my_model_Traindata/handpose-model.json"
//   );
//   // Verkrijg de voorspellingen van het model voor de invoerdata
//   const predictions = await handposeModel.executeAsync(tf.tensor4d(inputData));

//   // Verkrijg de handpose resultaten uit de voorspellingen
//   const handposeResults = predictions[0].dataSync();

//   // Verwerk de handpose resultaten voor verdere analyse
//   // ...
//   console.log(handposeResults);
// }
//
// start de webcam
//

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Webcam not available");
  }

  const video = document.getElementById("video");
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: VIDEO_WIDTH,
      height: VIDEO_HEIGHT,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

//
// predict de vinger posities in de video stream
//

async function startLandmarkDetection(video) {
  console.log('landmarks')
  videoWidth = video.videoWidth;
  videoHeight = video.videoHeight;

  canvas = document.getElementById("output");

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  ctx = canvas.getContext("2d");

  video.width = videoWidth;
  video.height = videoHeight;

  ctx.clearRect(0, 0, videoWidth, videoHeight);
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1); // video omdraaien omdat webcam in spiegelbeeld is

  predictLandmarks();
}

//
// predict de locatie van de vingers met het model
//

async function predictLandmarks() {
  ctx.drawImage(
    video,
    0,
    0,
    videoWidth,
    videoHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );
  // prediction!
  const predictions = await model.estimateHands(video);
  if (predictions.length > 0) {
    const result = predictions[0].landmarks;
    drawKeypoints(ctx, result, predictions[0].annotations);
    logData(predictions);
  }

  // 60 keer per seconde is veel, gebruik setTimeout om minder vaak te predicten
  requestAnimationFrame(predictLandmarks);

  // setTimeout(()=>predictLandmarks(), 1000)
}

//
// toon de eerste 20 waarden in een log - elk punt heeft een X, Y, Z waarde
//

function logData(predictions) {
  data = 0;
  // console.log(predictions[0].landmarks)
  for (let i = 0; i < 20; i++) {
    data +=
      predictions[0].landmarks[i][0] +
      ", " +
      predictions[0].landmarks[i][1] +
      ", " +
      predictions[0].landmarks[i][2] +
      ", ";
  }
  log.innerText = data;
}

//
// teken hand en vingers
//

function drawKeypoints(ctx, keypoints) {
  const keypointsArray = keypoints;

  for (let i = 0; i < keypointsArray.length; i++) {
    const y = keypointsArray[i][0];
    const x = keypointsArray[i][1];
    drawPoint(ctx, x - 2, y - 2, 3);
  }

  const fingers = Object.keys(fingerLookupIndices);
  for (let i = 0; i < fingers.length; i++) {
    const finger = fingers[i];
    const points = fingerLookupIndices[finger].map((idx) => keypoints[idx]);
    drawPath(ctx, points, false);
  }
}

//
// teken een punt
//

function drawPoint(ctx, y, x, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}
//
// teken een lijn
//

function drawPath(ctx, points, closePath) {
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region);
}

//
// start
//
main();
