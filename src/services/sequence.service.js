const { GpioService, gpio } = require('./gpio.service')
const { mainServer } = require('../server')
const config = require('../config/config')

const KEY_1 = 29
const KEY_2 = 31
const pinToKeyNumber = {
  [KEY_1]: 1,
  [KEY_2]: 2
}

class SequenceService {
  static start () {
    GpioService.declareGpioPin(KEY_1, gpio.DIR_IN, gpio.EDGE_BOTH)
    GpioService.declareGpioPin(KEY_2, gpio.DIR_IN, gpio.EDGE_BOTH)
    GpioService.listenOnChange((pin, state) => {
      if (pin === KEY_1 || pin === KEY_2) {
        if (!state) {
          const startIndex = (config.deviceName === 'crea1') ? 0 : 2
          const keyNumber = startIndex + pinToKeyNumber[pin]
          console.log('key', keyNumber)
          mainServer.socket.emit('sequence-answer', keyNumber)
        }
      }
    })
  }
}

module.exports = {
  SequenceService
}
