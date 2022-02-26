const users = [];

//addUser
const addUser = ({ id, username, room }) => {
  const playerReady = false;
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  //Validate data
  if (!username || !room) {
    return {
      error: "Username and room are required!",
    };
  }
  //Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }
  // If 2 people are already in a room:
  let player = 1;
  roomUsers = users.filter((user) => user.room === room);
  if (roomUsers.length == 2) {
    return {
      error: "There are already two people in this room! Create another room.",
    };
  } else if (roomUsers.length == 1) {
    player = 2;
  }
  //Store user
  const user = { id, username, room, player, playerReady };
  users.push(user);
  return {
    user,
  };
};

//removeUser

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//getUser
const getUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users[index];
  }
  return undefined;
};

//getOtherUser
const getOtherUser = (id) => {
  const index = users.findIndex((user) => user.id !== id);
  if (index !== -1) {
    return users[index];
  }
  return undefined;
};

const readyUser = (username) => {
  const index = users.findIndex((user) => user.username === username);
  if (index !== -1) {
    users[index].playerReady = true;
  }
};

//getUsersInRoom
const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return (usersInRoom = users.filter((user) => user.room === room));
};

const getReadyUsersInRoom = (room, username) => {
  room = room.trim().toLowerCase();
  return (usersInRoom = users.filter(
    (user) => user.room === room && playerReady
  ));
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  readyUser,
  getOtherUser,
  getUsersInRoom,
  getReadyUsersInRoom,
};
