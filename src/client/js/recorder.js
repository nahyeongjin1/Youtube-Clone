import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const previewVideo = document.getElementById("preview");

let stream;
let recorder;
let videoFileUrl;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumbnail: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFileUrl));

  await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumbnail
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbnailFile = ffmpeg.FS("readFile", files.thumbnail);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbnailBlob = new Blob([thumbnailFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbnailUrl = URL.createObjectURL(thumbnailBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbnailUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumbnail);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbnailUrl);
  URL.revokeObjectURL(videoFileUrl);

  actionBtn.addEventListener("click", handleStartClick);
  actionBtn.innerText = "Record Again";
  actionBtn.disabled = false;
  init();
};

const handleStopRecording = () => {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStopRecording);
  actionBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStartClick = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStartClick);
  actionBtn.addEventListener("click", handleStopRecording);

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

actionBtn.addEventListener("click", handleStartClick);
