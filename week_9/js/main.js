let model;
let customModel;
let labelMap;

const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const predictionLabel = document.getElementById("prediction-label");

let frameSequence = [];
const sequenceLength = 10;

/**
 *
 *
 * Setup the webcam, handpose model and custom model
 *
 *
 */

async function loadHandposeModel() {
  model = await handpose.load();
  console.log("Handpose model loaded");
}

async function loadCustomModel() {
  customModel = await tf.loadLayersModel("../../model/model.json");
  const labelMapResponse = await fetch("../../model/labelMap.json");
  const labelMapEntries = await labelMapResponse.json();
  labelMap = new Map(labelMapEntries);

  console.log("Custom model loaded");
}

async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const constraints = { video: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadedmetadata", () => resolve(), false);
      })
      .catch((error) => reject());
  });
}

/**
 *
 *
 * Predict hand poses and classify them
 *
 *
 */

async function predictHandposes() {
  while (true) {
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
      const keypoints = predictions[0].landmarks;
      const normalizedKeypoints = normalizeKeypoints(keypoints);

      if (frameSequence.length < sequenceLength) {
        frameSequence.push(normalizedKeypoints);
      } else {
        frameSequence.shift();
        frameSequence.push(normalizedKeypoints);

        // Convert frameSequence to a 3D tensor
        const inputTensor = tf.tensor3d([frameSequence]);
        const logits = customModel.predict(inputTensor);
        const classIndex = logits.argMax(-1).dataSync()[0];

        // Get the label of the prediction
        const label = getLabelFromIndex(labelMap, classIndex);

        // Get the probability of the prediction
        const probabilities = logits.softmax().dataSync();
        const accuracy = (probabilities[classIndex] * 100).toFixed(2);

        predictionLabel.textContent = `${label} (${accuracy}%)`;

        // Check for success
        if (checkSuccess(label, accuracy)) {
          showModal();
        }
      }

      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Draw dots at each keypoint location
      for (let j = 0; j < keypoints.length; j++) {
        const flippedX = canvas.width - keypoints[j][0];
        ctx.beginPath();
        ctx.arc(flippedX, keypoints[j][1], 5, 0, 2 * Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();

        ctx.restore();
      }
    } else {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    await tf.nextFrame();
  }
}

function normalizeKeypoints(keypoints) {
  const flattenedKeypoints = keypoints.flat();
  const maxX = Math.max(...flattenedKeypoints.filter((_, i) => i % 3 === 0));
  const maxY = Math.max(...flattenedKeypoints.filter((_, i) => i % 3 === 1));
  const maxZ = Math.max(...flattenedKeypoints.filter((_, i) => i % 3 === 2));
  return flattenedKeypoints.map((v, i) =>
    i % 3 === 0 ? v / maxX : i % 3 === 1 ? v / maxY : v / maxZ
  );
}

function getLabelFromIndex(labelMap, index) {
  return [...labelMap.entries()].find(([_, value]) => value === index)[0];
}

async function main() {
  await loadHandposeModel();
  await loadCustomModel();
  await setupWebcam();
  predictHandposes();
}

main();
