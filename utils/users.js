const users = [];

//addUser
const addUser = ({ id, username, room }) => {
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
  if (users.length == 2) {
    return {
      error: "There are already two people in this room! Create another room.",
    };
  } else if (users.length == 1) {
    player = 2;
  }
  //Store user
  const user = { id, username, room, player };
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

//getUsersInRoom
const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return (usersInRoom = users.filter((user) => user.room === room));
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getOtherUser,
  getUsersInRoom,
};
