const rooms = [];

// generate room ID
function makeID() {
    let room = "";
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const length = 6;
    while (room === '' || rooms.find(element => element === room)) {
        for ( var i = 0; i < length; i++ ) {
            room = room + characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    }
    rooms.push(room);
    return room;
}
  
module.exports = { makeID };