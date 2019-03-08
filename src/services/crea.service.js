const { mainServer } = require('../server')
const config = require('../config/config')
const { gpio, GpioService } = require('./gpio.service')
const SoundService = require('./sound.service')

const CREA_BUTTON_PIN = 22

GpioService.declareGpioPin(CREA_BUTTON_PIN, gpio.DIR_IN, gpio.EDGE_BOTH)

class CreaService {
  static async startCrea () {
    await CreaService.creaCycle()
  }

  static stopCrea () {
  }

  static async creaCycle () {
    const { data } = await CreaService.buttonEvent(Date.now())
    mainServer.socket.emit('creativity-trial-answer', {
      deviceName: config.deviceName,
      data
    })
    CreaService.creaCycle()
  }

  static async buttonEvent (cycleStartTime) {
    await GpioService.buttonChanged(CREA_BUTTON_PIN, true)
    mainServer.socket.emit('creativity-trial-recording', {
      deviceName: config.deviceName
    })
    console.log('start recording')
    const duration = Date.now() - cycleStartTime
    const recordProcess = SoundService.startRecording()
    await GpioService.buttonChanged(CREA_BUTTON_PIN, false)
    const recordedData = await SoundService.stopRecording(recordProcess)
    console.log('stop recording -> recordedData', recordedData.length)
    return { duration, data: recordedData }
  }
}

module.exports = { CreaService }
