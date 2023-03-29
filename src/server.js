import "./db";
import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

// configuration
app.set("views", `${process.cwd()}/src/views`);
app.set("view engine", "pug");

// middleware
app.use(logger); // Show http method, url, status code, etc, on console
app.use(express.urlencoded({ extended: true })); // makes express application understand req.body

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const handleListening = () =>
  console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
