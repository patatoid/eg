const gpio = require('rpi-gpio');
const config = require('./config');
const Helper = require('./helper');
const SoundService = require('./sound.service');
const words = require('./words');

const CREA_BUTTON_PIN = 13;
gpio.setup(CREA_BUTTON_PIN, gpio.DIR_IN, gpio.EDGE_BOTH);


let creaCurrentProcess = null;

class CreaService {
  static async handleCrea(socket) {
    console.log('starting crea');
    try {
      await CreaService.creaCycle(socket, config.deviceName, 0);
    } catch(e) {
      throw e;
    }
  }

  static startCrea() {
    console.log('launch crea');
    const url='http://localhost:3000/crea.html';
    creaCurrentProcess = Helper.launchProcess(['sh', ['./scripts/start-chromium.sh', url], {env: process.env}]);
  }

  static stopCrea() {
    console.log('Stop crea window');
    if(creaCurrentProcess) {
      creaCurrentProcess.stdin.pause();
      creaCurrentProcess.kill();
      creaCurrentProcess = null;
    }
  }

  static async creaCycle(socket, deviceName, index) {
    if(index>=10) return CreaService.stopCrea();
    console.log('cycle', index);
    const wordsSent = words[config.deviceName][index];
    socket.emit('words', wordsSent);
    const cycleStartTime = Date.now();
    const timeout = async (time) => { const duration = await Helper.sleep(time); return {duration: time, data: null}};
    const creaRecord = await Promise.race([
      CreaService.buttonEvent(cycleStartTime),
      timeout(5),
    ]);
    const { mainServer } = require('./server');
    mainServer.socket.emit('crea-record-'+config.deviceName, {...creaRecord, index, words: wordsSent, deviceName});
    await CreaService.creaCycle(socket, deviceName, index + 1);
  }

  static async buttonEvent(cycleStartTime) {
    await CreaService.buttonChanged(CREA_BUTTON_PIN, true);
    console.log('start recording');
    const duration = Date.now()-cycleStartTime;
    const recordProcess = SoundService.startRecording();
    await CreaService.buttonChanged(CREA_BUTTON_PIN, false);
    const recordedData = await SoundService.stopRecording(recordProcess);
    console.log('stop recording -> recordedData', recordedData.length);
    return {duration, data: recordedData.toString('base64')};
  }

  static async buttonChanged(pin, state) {
    return new Promise((resolve, reject) => {
      const listener = (channel, value) => {
        console.log('Channel ' + channel + ' value is now ' + value);
        if(channel === pin && state === value) {
          gpio.removeListener('change', listener);
          resolve(value);
        }
      };
      gpio.on('change', listener);
    });
  }
}

module.exports = {CreaService};
