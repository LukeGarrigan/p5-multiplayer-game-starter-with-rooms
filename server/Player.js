class Player {
  constructor(id, roomId) {
    this.x = Math.random() * 800 + 1;
    this.y = Math.random() * 800 + 1;
    this.id = id;
    this.roomId = roomId;
    this.rgb = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    }
  }

}

module.exports = Player;