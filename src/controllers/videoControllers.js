import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params; // === const id = req.params.id;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: `Search`, videos });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id: currentlyLoggedInUser },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(currentlyLoggedInUser)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
    session: {
      user: { _id: currentlyLoggedInUser },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(currentlyLoggedInUser)) {
    req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
    files: { video, thumbnail },
    session: {
      user: { _id: owner },
    },
  } = req;
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbnailUrl: isHeroku ? thumbnail[0].location : video[0].path,
      hashtags: Video.formatHashtags(hashtags),
      owner,
    });
    const user = await User.findById(owner);
    user.videos.push(newVideo._id);
    await user.save();
    return res.redirect("/");
  } catch (error) {
    const errorMessage = error._message;
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage,
    });
  }
};

export const getDelete = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id: currentlyLoggedInUser },
    },
  } = req;
  const video = await Video.findById(id);
  const user = await User.findById(currentlyLoggedInUser);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  if (String(video.owner) !== String(currentlyLoggedInUser)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  await user.save();
  return res.redirect("/");
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: {
      user: { _id: owner },
    },
  } = req;

  const video = await Video.findById(id);
  const user = await User.findById(owner);

  if (!video || !user) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner,
    video: id,
  });
  video.comments.push(comment._id);
  await video.save();
  user.comments.push(comment._id);
  await user.save();

  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  let index;
  const {
    params: { id: commentId },
    session: {
      user: { _id: currentLoginUser },
    },
  } = req;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.sendStatus(404);
  }
  const video = await Video.findById(comment.video);
  if (!video) {
    return res.sendStatus(404);
  }
  if (String(comment.owner) !== String(currentLoginUser)) {
    return res.sendStatus(404);
  }
  const user = await User.findById(comment.owner);
  await Comment.deleteOne({ _id: commentId });
  index = video.comments.indexOf(commentId);
  video.comments.splice(index, 1);
  await video.save();
  index = user.comments.indexOf(commentId);
  user.comments.splice(index, 1);
  await user.save();

  return res.sendStatus(204);
};
