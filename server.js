const app = require("express")();
const http = require("http").createServer(app);
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");
const { shuffle } = require("./utils/misc");
const { makeID } = require("./utils/rooms");

const wordlist1 = require("./words/common.json").commonWords;
const wordlist2 = require("./words/common2.json").commonWords;
shuffle(wordlist1);
shuffle(wordlist2);

// SOURCE: https://github.com/dariusk/corpora/blob/master/data/words/common.json

// CORS FUCK
const io = require("socket.io")(http, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const PORT = 8080;

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

io.on("connection", (socket) => {
  // Everything goes into here
  console.log("New Client Connected");
  socket.on("generateRoom", ({username, room}, callback) => {
  });
  socket.on("join", ({ username, room }, callback) => {
    if (!room) {
      room = makeID();
    }
    if (!username) {
      username = "anonymous_".concat((Math.floor(Math.random() * 100).toString()));
    }

    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    // socket.broadcast.to(room).emit() < Let the other user know that someone has joined.
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
      p1Wl: wordlist1,
      p2W2: wordlist2,
    });
    callback();
  });
  socket.on("typing", ({ text }, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("typeResponse", {
        ptext: text,
        player: user.player,
      });
    }
  });

  // spoof opponent based on combo achieved
  socket.on("getSpoofed", ({ combo }) => {
    maxCombo = 5;
    const user = getUser(socket.id);
    if (combo % maxCombo === 0 && otherUser) {
      io.to(user.room).emit("spoofed", {
        spoofedUser: user.player === 1 ? 2 : 1,
        spoofedWords: combo % maxCombo,
      });
    }
  });

  // win or lose condition
  socket.on("condHandle", ({ Loss }) => {
    if (Loss) {
      const loser = getUser(socket.id);
      io.to(loser.room).emit("win", {
        loser: loser.player,
      })
    }
  })

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

// TODO: GET POINT SYSTEM, WORDLIST,
