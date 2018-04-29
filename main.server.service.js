const mainSocketClient = require('socket.io-client')('http://localhost:3000');
mainSocketClient.on('connect', () => console.log('connected to mainServer'));
mainSocketClient.emit('identification', process.env.DEVICE_NAME);

module.exports=class MainServerService {
  static getSocket() {
    return mainSocketClient;
  }

  static send(channel, msg) {
    mainSocketClient.emit(channel, msg);
  }
}
