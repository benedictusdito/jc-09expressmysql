const express = require("express");
const userRouter = require("./routers/userRouter");
const taskRouter = require("./routers/taskRouter");
const powrt = require("./config/port");

const server = express();

// Proses.env.PORT -> run by heroku
const port = powrt;

server.use(express.json());
server.use(userRouter);
server.use(taskRouter);

server.get("/", (req, res) => {
  res.send("<h1>Selamat data di API Heroku </h1>");
});

server.listen(port, () => {
  console.log("Berhasil Running di" + port);
});
