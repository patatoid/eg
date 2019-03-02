const fs = require('fs')
const Helper = require('../helper')

const siren = 'siren.mp3'

const recordPath = './records/voice.wav'

let soundInProgress = false

class SoundService {
  static get siren () { return siren }

  static play (sound) {
    const music = './assets/sounds/' + sound
    Helper.launchProcess(['mpg123', [music]])
  }

  static async playAndWait (sound, seconds) {
    if (soundInProgress) return
    soundInProgress = true
    SoundService.play(sound)
    await Helper.sleep(seconds)
    soundInProgress = false
  }

  static startRecording () {
    const process = Helper.launchProcess(['arecord', ['--device=hw:1,0', '--format', 'S16_LE', '--rate', '44100', '-d', '5', '-c1', recordPath]])
    return process
  }

  static async stopRecording (process) {
    if (process) process.kill()
    return new Promise((resolve, reject) => {
      fs.readFile(recordPath, (err, data) => {
        if (err) resolve('error')
        resolve(data)
      })
    })
  }
}
module.exports = SoundService
