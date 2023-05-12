import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordBtn = document.getElementById("recordBtn");
const previewVideo = document.getElementById("preview");

let stream;
let recorder;
let videoFileUrl;

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFileUrl));

  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  const a = document.createElement("a");
  a.href = videoFileUrl;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click();
};

const handleStopRecording = () => {
  recordBtn.innerText = "Download Recording";
  recordBtn.removeEventListener("click", handleStopRecording);
  recordBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleRecordBtnClick = () => {
  recordBtn.innerText = "Stop Recording";
  recordBtn.removeEventListener("click", handleRecordBtnClick);
  recordBtn.addEventListener("click", handleStopRecording);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFileUrl = URL.createObjectURL(event.data);
    previewVideo.srcObject = null;
    previewVideo.src = videoFileUrl;
    previewVideo.loop = true;
    previewVideo.play();
  };
  recorder.start();
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
