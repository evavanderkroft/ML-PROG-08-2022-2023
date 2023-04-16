# Hand Gesture Recognition 🤚

This project demonstrates how to create a hand gesture recognition system using TensorFlow.js, Handpose model, and a custom LSTM model. The system can be used to train on custom hand gestures, evaluate the model's performance, and fine-tune a pre-trained model with additional gestures.

## Features 🌟

- Record hand gesture data from a webcam 📷
- Train a custom LSTM model on the recorded data 🚀
- Evaluate the model's performance on a test set 📊
- Fine-tune a pre-trained model with new gestures 🔧
- Download the trained model and label map for future use 💾

## How it works ⚙️

The application uses the Handpose model to detect hand landmarks from a webcam feed, and then trains a custom LSTM model to recognize different hand gestures based on the detected landmarks.

The main code is split into several sections:

1. **Setup the webcam and Handpose model**: Initialize the webcam and Handpose model to detect hand landmarks in real-time.
2. **Collect data**: Record hand gesture data while the user performs various gestures in front of the webcam.
3. **Train the model**: Train a custom LSTM model on the collected data, and evaluate its performance on a test set.
4. **Fine-tune the model**: Load a pre-trained model and fine-tune it with new training data.
5. **Download the model**: Download the trained model and label map for future use.

### Setup the webcam and Handpose model

This section sets up the webcam and loads the Handpose model for detecting hands in real-time.

### Collect data

This section collects hand gesture data from the webcam feed. The user can start and stop recording by clicking the "Start Recording" button, and enter the label for the gesture they want to record.

The collected data includes a sequence of frames, where each frame contains the normalized landmarks for a single hand detected by the Handpose model.

### Train the model

The custom LSTM model is created and trained on the collected data. The data is split into training and test sets, and the model's performance is evaluated on the test set.

### Fine-tune the model

The user can load a pre-trained model and fine-tune it with new training data. This is useful when the user wants to add more gestures to the model without retraining it from scratch.

### Download the model

After training or fine-tuning the model, the user can download the trained model and label map for future use.

## Usage 📚

To run the application, open `index.html` in your browser.

To collect gesture data, perform the following steps:

1. Enter the label for the gesture you want to record.
2. Click the "Start Recording" button to start recording.
3. Perform the gesture in front of the webcam.
4. Click the "Stop Recording" button to stop recording.

To train the model, click the "Train" button.

To fine-tune a pre-trained model, click the "Fine-tune" button.

To download the trained model and label map, click the "Download" button.

## Installation Guide

1. Install [Node.js](https://nodejs.org/en/download/) on your computer.

2. Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/signlearn.git
```

3. Navigate to the repository's root directory:

```bash
cd signlearn
```

4. Install the required dependencies:

```bash
npm install
```

5. Start the development server:

```bash
npm start
```

6. Open your browser and navigate to `http://localhost:3000` to access the application.

## How to Set Up

1. Ensure your device has a working webcam.

2. Grant the application permission to access your webcam when prompted.

3. Follow the on-screen instructions to imitate the target sign.

4. The application will provide real-time feedback on the accuracy of your hand signs.

5. Complete the challenges to improve your understanding of sign language.

## Credits

This project is powered by [TensorFlow.js](https://www.tensorflow.org/js) and the [Handpose model](https://github.com/tensorflow/tfjs-models/tree/master/handpose) for real-time hand detection and tracking.

## License

This project is open source and available under the [MIT License](LICENSE).
