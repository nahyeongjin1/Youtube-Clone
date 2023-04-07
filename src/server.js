import express from "express";
import morgan from "morgan";
import session from "express-session";

import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

// configuration
app.set("views", `${process.cwd()}/src/views`);
app.set("view engine", "pug");

// middleware
app.use(logger); // Show http method, url, status code, etc, on console
app.use(express.urlencoded({ extended: true })); // makes express application understand req.body

app.use(
  session({
    secret: "Hello",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
