const recordBtn = document.getElementById("recordBtn");
const previewVideo = document.getElementById("preview");

let stream;

const handleStopRecording = () => {
  recordBtn.innerText = "Start Recording";
  recordBtn.removeEventListener("click", handleStopRecording);
  recordBtn.addEventListener("click", handleRecordBtnClick);
};

const handleRecordBtnClick = () => {
  recordBtn.innerText = "Stop Recording";
  recordBtn.removeEventListener("click", handleRecordBtnClick);
  recordBtn.addEventListener("click", handleStopRecording);

  const recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    console.log("recording done");
    console.log(event);
    console.log(event.data);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  previewVideo.srcObject = stream;
  previewVideo.play();
};

init();

recordBtn.addEventListener("click", handleRecordBtnClick);
