import express from "express";
import {
  logout,
  getEdit,
  postEdit,
  startGithubLogin,
  finishGithubLogin,
  see,
} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;
