const Helper = require('./helper');
const mainSocketClient = require('socket.io-client')('http://localhost:3000');
mainSocketClient.on('connect', () => console.log('connected to mainServer'));

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

module.exports = class CreaService {
  static async handleCrea(socket) {
    console.log('starting crea');
    try{
    await CreaService.creaCycle(socket, 0);
    } catch( e) {
      throw e;
    }
  }

  static async creaCycle(socket, index) {
    if(index>=10) return;
    console.log('cycle', index);
    socket.emit('words', words[index]);
    const startTime = Date.now();
    const duration = await Promise.race([
      CreaService.buttonEvent(startTime),
      Helper.delay(5)
    ]);
    console.log('duration', duration);
    mainSocketClient.emit('crea-record', duration);
    await CreaService.creaCycle(socket, index + 1);
  }

  static async buttonEvent(startTime) {
    await Helper.delay(Math.random()*10);
    return Date.now()-startTime;
  }
}


