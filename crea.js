const config = require('./config');
const Helper = require('./helper');
const { gpio } = require('./gpio');
const SoundService = require('./sound.service');
const words = require('./words');

const CREA_BUTTON_PIN = 25;

Helper.declareGpioPin(CREA_BUTTON_PIN, gpio.DIR_IN, gpio.EDGE_BOTH);

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
    Helper.openChromium('crea.html');
  }

  static stopCrea() {
    console.log('Stop crea window');
    Helper.closeChromium();
  }

  static async creaCycle(socket, deviceName, index) {
    if(index>=10) return CreaService.stopCrea();
    const wordsSent = words[config.deviceName][index];
    console.log('cycle', index, wordsSent);
    socket.emit('words', wordsSent);
    const cycleStartTime = Date.now();
    const timeout = async (time) => { const duration = await Helper.sleep(time); return {duration: time, data: null}};
    const creaRecord = await Promise.race([
      CreaService.buttonEvent(cycleStartTime),
      timeout(10),
    ]);
    const { mainServer } = require('./server');
    mainServer.socket.emit('crea-record-'+config.deviceName, {...creaRecord, index, words: wordsSent, deviceName});
    await CreaService.creaCycle(socket, deviceName, index + 1);
  }

  static async buttonEvent(cycleStartTime) {
    await Helper.buttonChanged(CREA_BUTTON_PIN, true);
    console.log('start recording');
    const duration = Date.now()-cycleStartTime;
    const recordProcess = SoundService.startRecording();
    await Helper.buttonChanged(CREA_BUTTON_PIN, false);
    const recordedData = await SoundService.stopRecording(recordProcess);
    console.log('stop recording -> recordedData', recordedData.length);
    return {duration, data: recordedData};
  }
}

module.exports = {CreaService};
