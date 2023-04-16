import express from "express";
import {
  logout,
  getEdit,
  postEdit,
  startGithubLogin,
  finishGithubLogin,
  see,
} from "../controllers/userControllers";
import { memberOnlyMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", memberOnlyMiddleware, logout);
userRouter.route("/edit").all(memberOnlyMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;
