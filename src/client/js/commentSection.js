const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("form");

const handleBtnClick = (event) => {
  event.preventDefault();
  const comment = textarea.value;
  const videoId = videoContainer.dataset.id;
};

form.addEventListener("submit", handleBtnClick);
