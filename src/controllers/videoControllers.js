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
    views: 9,
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
export const see = (req, res) => {
  const { id } = req.params; // === const id = req.params.id;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching ${video.title}` });
};
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search Video");
export const deleteVideo = (req, res) => res.send("Delete Video");
export const upload = (req, res) => res.send("Upload Video");
