const recordBtn = document.getElementById("recordBtn");

const handleRecordBtnClick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  console.log(stream);
};

recordBtn.addEventListener("click", handleRecordBtnClick);
