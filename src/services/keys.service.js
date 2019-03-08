const { mainServer } = require('../server')
const { GpioService, gpio } = require('./gpio.service')
const config = require('../config/config')

const keys = [2000, 0, 0, 0]
const KEY_1 = 29
const KEY_2 = 31
const pinToKeyNumber = {
  [KEY_1]: 1,
  [KEY_2]: 2
}

class KeysService {
  static start () {
    GpioService.declareGpioPin(KEY_1, gpio.DIR_IN, gpio.EDGE_BOTH)
    GpioService.declareGpioPin(KEY_2, gpio.DIR_IN, gpio.EDGE_BOTH)
    GpioService.listenOnChange((pin, state) => {
      if (pin === KEY_1 || pin === KEY_2) {
        if (!state) {
          const startIndex = (config.deviceName === 'crea1') ? 0 : 2
          const keyNumber = startIndex + pinToKeyNumber[pin]
          console.log('key', keyNumber)
          mainServer.socket.emit('key-on', keyNumber)
        }
      }
    })
  }
  static saveKey (index) {
    keys[index - 1] = Date.now()
    console.log('saveKey', keys)
    const isInSameTime = KeysService.computeKeys()
    if (isInSameTime) {
      console.log('emit', 'keys-inserted')
      mainServer.socket.emit('four-keys-inserted')
    }
  }

  static computeKeys () {
    const min = Math.min(...keys)
    const max = Math.max(...keys)
    return !!((max - min) < 5000)
  }
}

module.exports = {
  KeysService
}
