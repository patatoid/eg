const fs = require('fs');
const Player = require('player');
const Helper = require('./helper');

const siren = './sounds/siren.mp3';

const recordPath = './records/voice.wav';

class SoundService {
  static get siren() { return siren; }

  static play(sound) {
   const player = new Player(sound);
   player.setVolume(1);
   player.play();
   player.on('error', (data) => {console.log('error sound service', data)})
  }

  static startRecording() {
     const process = Helper.launchProcess(['arecord', ['--device=hw:1,0', '--format', 'S16_LE', '--rate', '44100', '-d', '5', '-c1', recordPath]]);
     return process;
  }

  static async stopRecording(process) {
    if(process) process.kill();
    return new Promise((resolve, reject) => {
      fs.readFile(recordPath, (err, data) => {
        if (err) reject(err);
          console.log(data.length);
          resolve(data);
      });
    });
  }
}
module.exports = SoundService;
