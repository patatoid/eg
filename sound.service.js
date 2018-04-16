const Player = require('player');

const siren = './sounds/siren.mp3';

class SoundService {
  static get siren() { return siren; }

  static play(sound) {
   const player = new Player(sound); 
   player.play();
   player.on('error', () => {})
  }
}
module.exports = SoundService;
