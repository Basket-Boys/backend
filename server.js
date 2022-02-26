var app = require("express")();
var http = require("http").createServer(app);

// CORS FUCK
var io = require("socket.io")(http, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const PORT = 8080;

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

io.on("connection", (socket) => {
  console.log("New Client Connected");
  socket.emit("connection", null);
});
