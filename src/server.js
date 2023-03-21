import express from "express";

const PORT = 4000;

const app = express();

const handleRoot = (req, res) => {
  return res.send("<h1>It's not ready yet :(</h1>");
};
const handleLogin = (req, res) => {
  return res.send("It's LOGIN PAGE :)");
};

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed :(</h1>");
  }
  next();
};

app.use(logger);

app.get("/", handleRoot);

const handleListening = () =>
  console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
