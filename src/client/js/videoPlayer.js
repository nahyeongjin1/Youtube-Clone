const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

const handlePlayBtnClick = (e) => {
  if (video.paused) video.play();
  else video.pause();
};

const handleVideoPause = (e) => (playBtn.innerText = "Play");

const handleVideoPlay = (e) => (playBtn.innerText = "Pause");

const handleMute = (e) => {};

playBtn.addEventListener("click", handlePlayBtnClick);
video.addEventListener("pause", handleVideoPause);
video.addEventListener("play", handleVideoPlay);
muteBtn.addEventListener("click", handleMute);
