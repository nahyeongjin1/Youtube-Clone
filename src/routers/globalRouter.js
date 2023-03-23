import express from "express";
import { recommended } from "../controllers/videoControllers";
import { join } from "../controllers/userControllers";

const globalRouter = express.Router();

globalRouter.get("/", recommended);
globalRouter.get("/join", join);

export default globalRouter;
