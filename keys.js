
const keys = [2000,0,0,0];

class KeysService {
  static saveKey(index) {
    keys[index] = Date.now();
    const isInSameTime = computeKeys();
    if(isInSameTime) {
      emitSocketMessage('keys-inserted');
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
