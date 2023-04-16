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

let trainButton = document.getElementById("train");
let classifyButton = document.getElementById("classify");
let SaveButton = document.getElementById("save");
let predictionTxt = document.getElementById("prediction");
// predictionArray = new Array();

//
// start de applicatie
//

async function main() {
  model = await handpose.load();
  const video = await setupCamera();
  video.play();
  startLandmarkDetection(video);

  trainButton.addEventListener("click", train);
  classifyButton.addEventListener("click", classify);
  SaveButton.addEventListener("click", save);
}

function train() {
  let labelTxt = document.getElementById("label").value;
  knn.learn(
    data.split`,`.map((x) => +x),
    labelTxt
  );
  console.log(`training ${labelTxt}`);
}

function classify() {
  let prediction = knn.classify(data.split`,`.map((x) => +x));
  predictionTxt.innerHTML = prediction;
  console.log(prediction);
}

async function save() {
  
  await knn.save('')
  //   model = await handpose.load();
  const modelJSON = JSON.stringify(model, replacer);
  //   fs.writeFile("/", modelJSON);

  // Create a blob object from the JSON string
  const blob = new Blob([modelJSON], { type: "application/json" });

  // Create a URL object from the blob object
  const url = URL.createObjectURL(blob);

  // Create an <a> element to trigger the download
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "handpose-model.json";

  // Click the link to start the download
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

// your circular object

// Create a Set to keep track of visited objects
const seen = new Set();

// Define a replacer function to remove circular references
const replacer = (key, value) => {
  // Check if the value is an object
  if (typeof value === "object" && value !== null) {
    // Check if the object has already been seen
    if (seen.has(value)) {
      return undefined; // Remove circular reference
    }
    // Add the object to the set of seen objects
    seen.add(value);
  }
  return value; // Return the original value
};

// Convert the object to a JSON string, using the replacer function

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
