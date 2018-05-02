const { Helper } = require('./helper');
const { CreaService } = require('./crea');

class MainServerService {
  constructor(hostname) {
    this.mainSocketClient = require('socket.io-client')(`http://${hostname}:3000`);
  }
  get socket() {
    return this.mainSocketClient;
  }

  emit(channel, msg) {
    this.mainSocketClient.emit(channel, msg);
  }
}

module.exports={
  MainServerService
}
