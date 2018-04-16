const Helper = require('./helper');
const MainServerService = require('./main.server.service');

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
    const startTime = Date.now();
    const duration = await Promise.race([
      CreaService.buttonEvent(startTime),
      Helper.delay(5)
    ]);
    console.log('duration', duration);
    MainServerService.send('crea-record', duration);
    await CreaService.creaCycle(socket, index + 1);
  }

  static async buttonEvent(startTime) {
    await Helper.delay(Math.random()*10);
    return Date.now()-startTime;
  }
}


