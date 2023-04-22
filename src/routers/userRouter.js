import express from "express";
import {
  logout,
  getEdit,
  postEdit,
  startGithubLogin,
  finishGithubLogin,
  see,
  getChangePassword,
  postChangePassword,
} from "../controllers/userControllers";
import {
  avatarUpload,
  loggedInOnlyMiddleware,
  loggedOutOnlyMiddleware,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", loggedInOnlyMiddleware, logout);
userRouter
  .route("/edit")
  .all(loggedInOnlyMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(loggedInOnlyMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/github/start", loggedOutOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", loggedOutOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;
