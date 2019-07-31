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

applicationCache.get("/", res) => {
  res.send("Selamat datang di Heroku API")
}

server.listen(port, () => {
  console.log("Berhasil Running di" + port);
});
