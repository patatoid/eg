const Helper = require('./helper');
const SoundService = require('./sound.service');
const MainServerService = require('./main.server.service');
const gpio = require('rpi-gpio');
 
const CREA_BUTTON_PIN = 13;
gpio.setup(CREA_BUTTON_PIN, gpio.DIR_IN, gpio.EDGE_BOTH);


const words = [
  ['mot01', 'mot02', 'mot03'],
  ['mot11', 'mot12', 'mot13'],
  ['mot21', 'mot22', 'mot23'],
  ['mot31', 'mot32', 'mot33'],
  ['mot41', 'mot42', 'mot43'],
  ['mot51', 'mot52', 'mot53'],
  ['mot61', 'mot62', 'mot63'],
  ['mot71', 'mot72', 'mot73'],
  ['mot81', 'mot82', 'mot83'],
  ['mot91', 'mot92', 'mot93'],
];

let creaCurrentProcess = null;

module.exports = class CreaService {
  static async handleCrea(socket) {
    console.log('starting crea');
    try {
      await CreaService.creaCycle(socket, 0);
    } catch(e) {
      throw e;
    }
  }

  static async startCrea(socket) {
    console.log('launch crea');
    const url='http://localhost:3000/crea.html';
    creaCurrentProcess = Helper.launchProcess(['xinit', ['-e', 'chromium-browser', '--kiosk', '--start-fullscreen', '--window-size=1920,1080', url]]);
    //Helper.launchProcess(['sh', ['scripts/start-chromium.sh'], {env: {URL: url}}]);
  }

  static stopCrea() {
    console.log('Stop crea window');
    if(creaCurrentProcess) {
      creaCurrentProcess.stdin.pause();
      creaCurrentProcess.kill();
      creaCurrentProcess = null;
    }
  }

  static async creaCycle(socket, index) {
    if(index>=10) return CreaService.stopCrea();
    console.log('cycle', index);
    socket.emit('words', words[index]);
    const cycleStartTime = Date.now();
    const creaRecord = await Promise.race([
      CreaService.buttonEvent(cycleStartTime),
      Helper.delay(30)
    ]);
    MainServerService.send('crea-record', creaRecord);
    await CreaService.creaCycle(socket, index + 1);
  }

  static async buttonEvent(cycleStartTime) {
    await CreaService.buttonChanged(CREA_BUTTON_PIN, true);
    console.log('start recording');
    const startTime = Date.now()-cycleStartTime;
    const recordProcess = SoundService.startRecording();
    await CreaService.buttonChanged(CREA_BUTTON_PIN, false);
    const recordedData = await SoundService.stopRecording(recordProcess);
    console.log('stop recording -> recordedData', recordedData.length);
    return {startTime, data: recordedData.toString('base64')};
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


