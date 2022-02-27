// Emit:
// join
// getSpoofed
// condHandle
// displayList
// mistakeCount
// sendFlagAr
// sendBlockageIndex

// Listen:
// roomData
// spoofed
// win
// displayList
// mistakeCount
// sendFlagAr
// sendBlockageIndex

const app = require("express")();
const http = require("http").createServer(app);
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getOtherUser,
} = require("./utils/users");
const { makeID } = require("./utils/rooms");

// SOURCE: https://github.com/dariusk/corpora/blob/master/data/words/common.json

// CORS FUCK
const io = require("socket.io")(http, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const PORT = process.env.PORT || 8080;

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("hi");
});

io.on("connection", (socket) => {
  // Everything goes into here
  console.log("New Client Connected");
  socket.on("join", ({ username, room }, callback) => {
    if (!room) {
      room = makeID();
    }
    if (!username) {
      username = "anonymous".concat(Math.floor(Math.random() * 100).toString());
    }

    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    // socket.broadcast.to(room).emit() < Let the other user know that someone has joined.
    const usersInRoom = getUsersInRoom(user.room);
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: usersInRoom,
    });
    callback();
  });

  // socket.on("typing", ({ text }, callback) => {
  //   const user = getUser(socket.id);
  //   if (user) {
  //     io.to(user.room).emit("typeResponse", {
  //       ptext: text,
  //       player: user.player,
  //     });
  //   }
  // });

  // ======================================= LISTEN =====================================

  // spoof opponent based on combo achieved
  // Listen: getSpoofed
  // Emit: spoofed
  socket.on("getSpoofed", ({ combo }) => {
    maxCombo = 5;
    const user = getUser(socket.id);
    if (combo % maxCombo === 0) {
      io.to(user.room).emit("spoofed", {
        spoofedUserPlayer: user.player === 1 ? 2 : 1,
        spoofedWords: combo / maxCombo,
      });
    }
  });

  // win or lose condition
  // Listen: condHandle
  // Emit: win
  socket.on("condHandle", ({ loss }) => {
    if (loss) {
      const loser = getUser(socket.id);
      io.to(loser.room).emit("win", {
        loser,
      });
    }
  });

  // To display the list of words on the opponent's end
  // Listen: displayList
  // Emit: displayList
  socket.on("displayList", (wordList) => {
    const user = getOtherUser(socket.id);
    io.to(user.room).emit("displayList", { wordList, user });
  });

  // To get opponent's mistakes
  // Listen: mistakeCount
  // Emit: mistakeCount
  socket.on("mistakeCount", (mistakeCount) => {
    const user = getOtherUser(socket.id);
    io.to(user.room).emit("mistakeCount", { mistakeCount, user });
  });

  // To pass the flag array
  // Listen: sendFlagArr
  // Emit: sendFlagArr
  socket.on("sendFlagArr", (flagArr) => {
    const user = getOtherUser(socket.id);
    io.to(user.room).emit("sendFlagArr", { flagArr, user });
  });

  // To pass the blockage word indices
  // Listen: sendBlockageIndex
  // Emit: sendBlockageIndex
  socket.on("sendBlockageIndex", (blockageWordIndexes) => {
    const user = getOtherUser(socket.id);
    io.to(user.room).emit("sendBlockageIndex", { blockageWordIndexes, user });
  });

  // Disconnects when user exits - auto, nothing to be done.
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.emit("connection", null);
});
