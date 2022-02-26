const rooms = [""];

// generate room ID
function makeID() {
    let room = "";
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const length = 6;
    while (rooms.find(element => element === room)) {
        for ( var i = 0; i < length; i++ ) {
            room += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    }
    rooms.push(room);
    return room;
}
  
module.exports = { makeID };