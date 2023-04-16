const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
