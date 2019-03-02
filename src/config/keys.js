const { SocketService } = require('../services/socket.service');

const keys = [2000,0,0,0];

class KeysService {
  static saveKey(index) {
    keys[index-1] = Date.now();
    console.log('saveKey', keys);
    const isInSameTime = KeysService.computeKeys();
    if(isInSameTime) {
     console.log('emit', 'keys-inserted')
      SocketService.emitSocketMessage('keys-inserted');
    }
  }

  static computeKeys() {
    const min = Math.min(...keys);
    const max = Math.max(...keys);
    return !!((max-min) < 1000);
  }
}

module.exports = {
  KeysService,
}
