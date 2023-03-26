let videos = [
  {
    title: "First Video",
    ratings: 5,
    comments: 2,
    createdAt: "20 minutes ago",
    views: 59,
    id: 1,
  },
  {
    title: "Second Video",
    ratings: 3,
    comments: 2,
    createdAt: "1 minutes ago",
    views: 1,
    id: 2,
  },
  {
    title: "Third Video",
    ratings: 4.3,
    comments: 31,
    createdAt: "43 minutes ago",
    views: 452,
    id: 3,
  },
];
export const recommended = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params; // === const id = req.params.id;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  console.log(title);
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    ratings: 0,
    comments: 0,
    createdAt: "just now",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
