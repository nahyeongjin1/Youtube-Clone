const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleBtnClick = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const comment = textarea.value;
  const videoId = videoContainer.dataset.id;
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    body: {
      comment,
    },
  });
};

if (form) {
  form.addEventListener("submit", handleBtnClick);
}
