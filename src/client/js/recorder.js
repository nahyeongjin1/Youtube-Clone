const recordBtn = document.getElementById("recordBtn");
const previewVideo = document.getElementById("preview");

const handleRecordBtnClick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  previewVideo.srcObject = stream;
  previewVideo.play();
};

recordBtn.addEventListener("click", handleRecordBtnClick);
