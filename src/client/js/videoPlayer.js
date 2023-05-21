const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsMovementTimeoutId = null;
let controlsTimeoutId = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayBtnClick = () => {
  if (video.paused) video.play();
  else video.pause();
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleVideoPause = () => (playBtn.innerText = "Play");

const handleVideoPlay = () => (playBtn.innerText = "Pause");

const handleMute = () => {
  if (video.muted) {
    video.muted = false;
    video.volume = volumeValue;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeInput = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substring(14, 19);
};

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreenBtnClick = () => {
  const fullscreenElement = document.fullscreenElement;
  if (fullscreenElement) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMoveOnVideo = () => {
  if (controlsTimeoutId) {
    clearTimeout(controlsTimeoutId);
    controlsTimeoutId = null;
  }
  if (controlsMovementTimeoutId) {
    clearTimeout(controlsMovementTimeoutId);
    controlsMovementTimeoutId = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeoutId = setTimeout(hideControls, 3000);
};

const handleMouseLeaveOnVideo = () => {
  controlsTimeoutId = setTimeout(hideControls, 3000);
};

const handleVideoClick = () => {
  handlePlayBtnClick();
};

const handleVideoDblclick = () => {
  handleFullScreenBtnClick();
};

const handleSpaceBarDown = (event) => {
  if (event.key == " " || event.key == "Spacebar" || event.key == 32)
    handlePlayBtnClick();
};

const handleVideoEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeInput);
video.addEventListener("canplay", handleLoadedMetadata);
handleLoadedMetadata();
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("change", handleTimelineChange);
fullScreen.addEventListener("click", handleFullScreenBtnClick);
videoContainer.addEventListener("mousemove", handleMouseMoveOnVideo);
videoContainer.addEventListener("mouseleave", handleMouseLeaveOnVideo);
video.addEventListener("click", handleVideoClick);
video.addEventListener("dblclick", handleVideoDblclick);
document.addEventListener("keydown", handleSpaceBarDown);
video.addEventListener("ended", handleVideoEnded);
