// Declare variables for handpose model, recording state, and data collection
let model;
let recording = false;
let gestureData = [];
let labelMap;

// Get DOM elements for video, canvas, buttons, and input fields
const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const gestureLabelInput = document.getElementById("gesture-label");
const startButton = document.getElementById("start");
const trainButton = document.getElementById("train");
const downloadButton = document.getElementById("download");
const recordingIndicator = document.getElementById("recording-indicator");

// Initialize variables for collecting a sequence of frames
let frameSequence = [];
const sequenceLength = 10; // Adjust this to set the length of the sequence

/**
 *
 *
 * Setup the webcam and handpose model
 *
 *
 */

// Load the handpose model for detecting hands
async function loadHandposeModel() {
  model = await handpose.load();
  console.log("Handpose model loaded");
}

// Add event listeners for record buttons
startButton.addEventListener("click", () => {
  recording = !recording;

  if (recording) {
    startButton.textContent = "Stop Recording";
    recordingIndicator.style.display = "block";
  } else {
    startButton.textContent = "Start Recording";
    recordingIndicator.style.display = "none";
  }
});

// func to start the webcam
async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const constraints = { video: true };

    // Get the video stream from the user's camera
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        // Set the video source object to the user's camera stream
        video.srcObject = stream;
        // When the metadata for the video is loaded, resolve the promise
        video.addEventListener("loadedmetadata", () => resolve(), false);
      })
      .catch((error) => reject());
  });
}

// func to predict handposes for every frame
async function collectData() {
  while (true) {
    //gets the predictions from the handpose model
    const predictions = await model.estimateHands(video);
    // If there are any predictions and recording is enabled, add the normalized keypoints to the frame sequence
    if (predictions.length > 0 && recording) {
      const keypoints = predictions[0].landmarks;

      // Normalize the keypoints
      const normalizedKeypoints = normalizeKeypoints(keypoints);

      // If the frame sequence is not full, add the normalized keypoints to the end of the sequence
      if (frameSequence.length < sequenceLength) {
        frameSequence.push(normalizedKeypoints);
      }
      // If the frame sequence is full, shift the first element out and add the normalized keypoints to the end of the sequence
      else {
        frameSequence.shift();
        frameSequence.push(normalizedKeypoints);
        // Get the label for the gesture and add the gesture data to the gestureData array
        const gestureLabel = gestureLabelInput.value;
        gestureData.push({
          features: frameSequence.slice(),
          label: gestureLabel,
        });
      }
    }

    // Clear the canvas and draw the video frame on the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // If there are any predictions, draw dots at each keypoint location on the canvas
    if (predictions.length > 0) {
      const keypoints = predictions[0].landmarks;

      for (let j = 0; j < keypoints.length; j++) {
        ctx.beginPath();
        ctx.arc(keypoints[j][0], keypoints[j][1], 5, 0, 2 * Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();
      }
    }

    // Wait for the next frame
    await tf.nextFrame();
  }
}

async function init() {
  await loadHandposeModel();
  await setupWebcam();
  collectData();
}

init();

/**
 *
 *
 * Train the model
 *
 *
 */

// Add event listener for train button
trainButton.addEventListener("click", async () => {
  // Get label map for the gesture data
  labelMap = getLabelMap(gestureData);

  // Split data into training and testing sets
  const { trainingSet, testSet } = splitData(gestureData);

  // Train the model on the training set
  const trainedModel = await trainModel(trainingSet, labelMap);

  // Evaluate the trained model on the testing set
  const testAccuracy = await evaluateModel(trainedModel, testSet, labelMap);
  console.log("Test accuracy:", testAccuracy);

  if (trainModel) downloadButton.disabled = false;

  // Add event listener to download the trained model and label map
  downloadButton.addEventListener("click", () =>
    downloadModel(trainedModel, labelMap)
  );
});

// Function to train the model
async function trainModel(gestureData, labelMap) {
  const numClasses = labelMap.size;

  // Convert the gestureData to tensors
  const data = gestureData.map((d) => d.features);
  const labelsArray = gestureData.map((d) => labelMap.get(d.label));

  // Perform data augmentation by flipping the data horizontally
  const flippedData = data.map((d) =>
    d.map((frame) =>
      frame
        .map((value, i) => (i % 3 === 0 ? -value : value))
        .map((value, i) => (i % 3 === 0 ? value * -1 : value))
    )
  );

  const augmentedDataArray = [...data, ...flippedData];
  const augmentedLabelsArray = [...labelsArray, ...labelsArray];

  // Convert the augmented data to tensors
  const augmentedData = tf.tensor3d(augmentedDataArray, [
    augmentedDataArray.length,
    sequenceLength,
    gestureData[0].features[0].length,
  ]);

  // Convert the augmented labels to tensors
  const augmentedLabels = tf.oneHot(
    tf.tensor1d(augmentedLabelsArray, "int32"),
    numClasses
  );

  // Create and compile the custom model
  const customModel = createCustomModel(
    augmentedData.shape[1],
    augmentedData.shape[2],
    numClasses
  );

  // Compile the custom model
  customModel.compile({ optimizer: "adam", loss: "categoricalCrossentropy" });

  // Train the custom model
  await customModel.fit(augmentedData, augmentedLabels, {
    batchSize: 16,
    epochs: 20,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1} - Loss: ${logs.loss.toFixed(5)}`);
      },
    },
  });

  return customModel;
}

// Function to evaluate the model
function createCustomModel(sequenceLength, inputSize, numClasses) {
  const model = tf.sequential();

  // Add a 1D convolutional layer for local feature extraction from the input sequence
  model.add(
    tf.layers.conv1d({
      filters: 32,
      kernelSize: 3,
      activation: "relu",
      inputShape: [sequenceLength, inputSize],
    })
  );

  // Add a bidirectional LSTM layer for temporal feature extraction
  model.add(
    tf.layers.bidirectional({
      layer: tf.layers.lstm({
        units: 100,
        activation: "relu",
        returnSequences: true,
      }),
      mergeMode: "concat",
      inputShape: [sequenceLength - 2, inputSize],
    })
  );

  model.add(tf.layers.dropout({ rate: 0.3 }));

  // Add a LSTM layer for temporal feature extraction
  model.add(
    tf.layers.lstm({ units: 50, activation: "relu", returnSequences: false })
  );

  model.add(
    tf.layers.dense({
      units: numClasses,
      activation: "softmax",
      kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }),
    })
  );

  return model;
}

/**
 * Gets a mapping of class labels to integers from the gesture data
 * @param {Array} gestureData - The gesture data
 * @returns {Map} The mapping of class labels to integers
 */
function getLabelMap(gestureData) {
  // Get the unique labels from the gesture data
  const uniqueLabels = [...new Set(gestureData.map((d) => d.label))];

  // Create a mapping of class labels to integers
  const labelMap = new Map(uniqueLabels.map((label, index) => [label, index]));

  return labelMap;
}

/**
 * Normalizes the keypoints
 * @param {Array} keypoints - The keypoints to be normalized
 * @returns {Array} The normalized keypoints
 */

function normalizeKeypoints(keypoints) {
  const flattenedKeypoints = keypoints.flat();
  const maxX = Math.max(...flattenedKeypoints.filter((_, i) => i % 3 === 0));
  const maxY = Math.max(...flattenedKeypoints.filter((_, i) => i % 3 === 1));
  const maxZ = Math.max(...flattenedKeypoints.filter((_, i) => i % 3 === 2));
  return flattenedKeypoints.map((v, i) =>
    i % 3 === 0 ? v / maxX : i % 3 === 1 ? v / maxY : v / maxZ
  );
}

/**
 *
 *
 * Evaluate Model and create training and test sets
 *
 *
 */

/**
 * Splits the gesture data into training and test sets
 * @param {Array} gestureData - The gesture data to be split
 * @param {Number} [testRatio=0.2] - The ratio of data to be included in the test set
 * @returns {Object} An object containing the training set and test set
 */
function splitData(gestureData, testRatio = 0.2) {
  // Shuffle the gesture data
  const shuffledData = shuffleArray([...gestureData]);

  // Calculate the size of the test set
  const testSetSize = Math.floor(shuffledData.length * testRatio);

  // Split the shuffled data into test and training sets
  const testSet = shuffledData.slice(0, testSetSize);
  const trainingSet = shuffledData.slice(testSetSize);

  return { trainingSet, testSet };
}

/**
 * Shuffles an array in place
 * @param {Array} array - The array to be shuffled
 * @returns {Array} The shuffled array
 */
function shuffleArray(array) {
  // Use the Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Evaluates a model's accuracy on the test data
 * @param {tf.LayersModel} model - The model to be evaluated
 * @param {Array} testData - The test data to use for evaluation
 * @param {Map} labelMap - The mapping of class labels to integers
 * @returns {Number} The accuracy of the model on the test data
 */
async function evaluateModel(model, testData, labelMap) {
  // Get the number of classes
  const numClasses = labelMap.size;

  // Prepare the data and labels for evaluation
  const data = testData.map((d) => d.features);
  const labelsArray = testData.map((d) => labelMap.get(d.label));

  // Convert the data and labels to tensors
  const testDataTensor = tf.tensor3d(data, [
    data.length,
    sequenceLength,
    testData[0].features[0].length,
  ]);
  const testLabelsTensor = tf.oneHot(
    tf.tensor1d(labelsArray, "int32"),
    numClasses
  );

  // Get the model's predictions
  const logits = model.predict(testDataTensor);
  const predictions = logits.argMax(-1);

  // Calculate the accuracy
  const accuracy = (
    await tf.metrics
      .categoricalAccuracy(testLabelsTensor, predictions)
      .mean()
      .data()
  )[0];

  return accuracy;
}

/**
 *
 *
 * Fine tune the model
 *
 */

const fineTuneButton = document.getElementById("fine-tune");

async function fineTuneModel(model, trainingData, labelMap) {
  const data = trainingData.map((d) => d.features);
  const labelsArray = trainingData.map((d) => labelMap.get(d.label));
  const trainingDataTensor = tf.tensor3d(data, [
    data.length,
    sequenceLength,
    trainingData[0].features[0].length,
  ]);
  const trainingLabelsTensor = tf.oneHot(
    tf.tensor1d(labelsArray, "int32"),
    labelMap.size
  );

  // Calculate the number of classes from the one-hot encoded labels
  const numClasses = trainingLabelsTensor.shape[1];

  // Update the output layer of the model to match the number of classes
  const newOutputLayer = tf.layers.dense({
    units: numClasses,
    activation: "softmax",
    kernelInitializer: "varianceScaling",
    useBias: true,
  });
  model.pop();
  model.add(newOutputLayer);

  // Compile the model
  model.compile({
    optimizer: tf.train.adam(0.0001),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  // Train the model on the new training data
  await model.fit(trainingDataTensor, trainingLabelsTensor, {
    batchSize: 16,
    epochs: 20,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(
          `Epoch ${epoch + 1} - Loss (fine-tuning): ${logs.loss.toFixed(5)}`
        );
      },
    },
  });
}

// Load label map from JSON file in the project folder
async function loadLabelMapFromFolder(url) {
  try {
    const response = await fetch(url);
    const labelMapArray = await response.json();
    return new Map(labelMapArray);
  } catch (err) {
    console.error("Error loading the label map:", err);
  }
}

// Load a pre-trained model from the project folder
async function loadModelFromFolder(url) {
  try {
    return await tf.loadLayersModel(url);
  } catch (err) {
    console.error("Error loading the model:", err);
  }
}

fineTuneButton.addEventListener("click", async () => {
  // Load the local model and label map
  const localModel = await loadModelFromFolder("/model/model.json");
  const localLabelMap = await loadLabelMapFromFolder("/model/labelMap.json");

  if (!localModel || !localLabelMap) {
    console.error(
      "Failed to load the model or label map from the local folder."
    );
    return;
  }

  if (!gestureData.length) {
    console.error("No training data to fine-tune the model on.");
    return;
  }

  // Get the training set and label map from the gesture data
  const { trainingSet } = splitData(gestureData);
  const labelMap = getLabelMap(gestureData);

  // Merge the local label map with the new label map
  for (const [label, index] of localLabelMap) {
    if (!labelMap.has(label)) {
      labelMap.set(label, labelMap.size);
    }
  }

  // Fine-tune the model on the new training data
  await fineTuneModel(localModel, trainingSet, labelMap);

  // Enable the download button and update the event listener
  downloadButton.disabled = false;
  downloadButton.removeEventListener("click", downloadModel);
  downloadButton.addEventListener("click", () =>
    downloadModel(localModel, labelMap)
  );
});

/**
 *
 *
 * Download the model
 *
 */

/**
 * Downloads the trained model and its label map
 * @param {tf.LayersModel} trainedModel - The trained model
 */

async function downloadModel(model, labels) {
  // Save the model to local storage
  const modelSaveURL = "downloads://sign_language_model";
  await model.save(modelSaveURL);

  // Save the label map as a JSON file
  const labelMapToSave = labels ? Array.from(labels) : Array.from(labelMap);
  if (!labelMapToSave.length) return console.error("No label map to save");
  const labelMapBlob = new Blob([JSON.stringify(labelMapToSave)], {
    type: "application/json",
  });
  const labelMapURL = URL.createObjectURL(labelMapBlob);

  // Create a link to download the label map JSON file
  const link = document.createElement("a");
  link.href = labelMapURL;
  link.download = "labelMap.json";
  document.body.appendChild(link);

  // Simulate a click on the link to start the download
  link.click();

  // Remove the link from the DOM
  setTimeout(() => {
    document.body.removeChild(link);
  }, 0);
}
