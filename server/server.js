const express = require("express");
const socket = require('socket.io');
const app = express();
const short = require('short-uuid');

const Player = require("./Player");

const ROOM_MAX_CAPACITY = 2;

const server = app.listen(80);
console.log('The server is now running at http://localhost/');
app.use(express.static("public"));
const io = socket(server);

const rooms = [short.generate()];
let players = [];
setInterval(updateGame, 16);

io.sockets.on("connection", socket => {
  console.log(`New connection ${socket.id}`);

  const roomId = getRoom();
  players.push(new Player(socket.id, roomId));

  socket.join(roomId);

  socket.on("disconnect", () => {
    io.sockets.emit("disconnect", socket.id);
    players = players.filter(player => player.id !== socket.id);
  });
});

function updateGame() {
  for (const room of rooms) {
    const playersInRoom = players.filter(p => p.roomId === room);
    io.to(room).emit("heartbeat", playersInRoom);
  }
}

function getRoom() {
  let leastPopulatedCount = Infinity;
  let leastPopulatedRoom = rooms[0];
  for (const room of rooms) {
    const count = players.filter(p => p.roomId == room).length;
    if (count < leastPopulatedCount) {
      leastPopulatedCount = count;
      leastPopulatedRoom = room;
    }
  }

  if (leastPopulatedCount >= ROOM_MAX_CAPACITY) {
    
    const newRoom = short.generate()
    console.log('Creating new room', newRoom);
    rooms.push(newRoom);
    leastPopulatedRoom = newRoom; 
  }
  return leastPopulatedRoom;
}



