const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
const video = document.getElementById("webcam");
const label = document.getElementById("label");
// const maskbtn = document.getElementById("mask")

const labelOneBtn = document.querySelector("#labelOne");
const labelTwoBtn = document.querySelector("#labelTwo");
const labelThreeBtn = document.querySelector("#labelThree");
const trainbtn = document.querySelector("#train");

labelOneBtn.addEventListener("click", () => addMaskImage("nike schoen"));
labelTwoBtn.addEventListener("click", () => addMaskImage("Geen nike schoen"));
labelThreeBtn.addEventListener("click", () => saveModel());
trainbtn.addEventListener("click", () => trainModel());

// trainbtn.addEventListener("click", () => console.log("train"));

function modelLoaded(video) {
    console.log('Model Loaded!');
    classifier = featureExtractor.classification(video, videoReady);
}
function videoReady(){
    console.log("the webcam is ready")
};

function addMaskImage(label) {
    classifier.addImage(video, label, (image)=>{
        console.log(image)
    }) 
}

function trainModel(){
    classifier.train((lossValue) => {
        console.log('Loss is', lossValue)
        if(lossValue == null) console.log("Finished training")
    })
}

function saveModel(){
    featureExtractor.save();
}

// label = document.getElementById("label")

setInterval(()=>{
    classifier.classify(video, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        label.innerHTML = result[0].label
    })
}, 1000)

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            modelLoaded(video);
        })
        .catch((err) => {
            console.log("Something went wrong!");
        });
}

label.innerText = "Ready when you are!";
