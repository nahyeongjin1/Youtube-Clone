import express from "express";
import morgan from "morgan";

const PORT = 4000;
const logger = morgan("dev");

const app = express();

const handleRoot = (req, res) => {
  return res.send("<h1>It's not ready yet :(</h1>");
};
const handleLogin = (req, res) => {
  return res.send("It's LOGIN PAGE :)");
};

app.use(logger);

app.get("/", handleRoot);

const handleListening = () =>
  console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
