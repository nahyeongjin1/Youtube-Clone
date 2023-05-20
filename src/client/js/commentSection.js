const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtnArray = document.querySelectorAll(".deleteBtn span");

const addFakeComment = (text, newCommentId) => {
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span1 = document.createElement("span");
  span1.innerText = ` ${text}`;
  const div1 = document.createElement("div");
  div1.appendChild(icon);
  div1.appendChild(span1);
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.addEventListener("click", handleDeleteBtnClick);
  const div2 = document.createElement("div");
  div2.className = "deleteBtn";
  div2.appendChild(span2);
  const newComment = document.createElement("li");
  newComment.dataset.id = newCommentId;
  newComment.className = "video__comment";
  newComment.appendChild(div1);
  newComment.appendChild(div2);
  const videoComments = document.querySelector(".video__comments ul");
  videoComments.prepend(newComment);
};

const handleBtnClick = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") return;
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addFakeComment(text, newCommentId);
  }
};

const handleDeleteBtnClick = async (event) => {
  const comment = event.target.parentElement.parentElement;
  const commentId = comment.dataset.id;
  const { status } = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
  if (status === 204) {
    comment.remove();
  }
};

if (form) {
  form.addEventListener("submit", handleBtnClick);
}
if (deleteBtnArray) {
  deleteBtnArray.forEach((deleteBtn) =>
    deleteBtn.addEventListener("click", handleDeleteBtnClick)
  );
}
