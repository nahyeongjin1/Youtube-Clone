import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  getDelete,
} from "../controllers/videoControllers";
import { loggedInOnlyMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(loggedInOnlyMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(loggedInOnlyMiddleware)
  .get(getDelete);
videoRouter
  .route("/upload")
  .all(loggedInOnlyMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);

export default videoRouter;
