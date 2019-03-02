const _ = require('lodash')
const config = require('../config/config')
const Helper = require('../helper')
const { SocketService } = require('./socket.service')
const SoundService = require('./sound.service')
const { gpio, GpioService } = require('./gpio.service')

const WASON_LEARING_BUTTON_1_PIN = 13
const WASON_LEARING_BUTTON_2_PIN = 15
const WASON_LEARING_BUTTON_3_PIN = 16
const WASON_LEARING_BUTTON_4_PIN = 18

const fusibleToIndex = {
  '12': 0,
  '13': 1,
  '15': 2,
  '16': 3
}

const pinToIndex = {
  [WASON_LEARING_BUTTON_1_PIN]: 0,
  [WASON_LEARING_BUTTON_2_PIN]: 1,
  [WASON_LEARING_BUTTON_3_PIN]: 2,
  [WASON_LEARING_BUTTON_4_PIN]: 3
}

const shift = {
  'main': 1,
  'crea1': 2,
  'crea2': 3,
  'crea3': 4
}

if (config.deviceName != 'elec') {
  GpioService.declareGpioPin(WASON_LEARING_BUTTON_1_PIN, gpio.DIR_IN, gpio.EDGE_BOTH)
  GpioService.declareGpioPin(WASON_LEARING_BUTTON_2_PIN, gpio.DIR_IN, gpio.EDGE_BOTH)
  GpioService.declareGpioPin(WASON_LEARING_BUTTON_3_PIN, gpio.DIR_IN, gpio.EDGE_BOTH)
  GpioService.declareGpioPin(WASON_LEARING_BUTTON_4_PIN, gpio.DIR_IN, gpio.EDGE_BOTH)
}

const reactorsButtonChoice = {
  main: [
    { code: 'temp_high#unkown', label: 'Surchauffe / Inconnu', id: [1] },
    { code: 'unknown#pre_normal', label: 'Inconnu / Pression normale', id: [2] },
    { code: 'unknown#pre_high', label: 'Inconnu / Surpression', id: [3] },
    { code: 'temp_normal#unknown', label: 'Chauffe normale / Inconnu', id: [4] }
  ],
  crea1: [
    { code: 'unknown#pre_normal', label: 'Inconnu / Pression normale', id: [] },
    { code: 'temp_high#unkown', label: 'Surchauffe / Inconnu', id: [] },
    { code: 'unknown#pre_high', label: 'Inconnu / Surpression', id: [] },
    { code: 'temp_normal#unknown', label: 'Chauffe normale / Inconnu', id: [] }
  ],
  crea2: [
    { code: 'unknown#pre_normal', label: 'Inconnu / Pression normale', id: [] },
    { code: 'temp_high#unkown', label: 'Surchauffe / Inconnu', id: [] },
    { code: 'temp_normal#unknown', label: 'Chauffe normale / Inconnu', id: [] },
    { code: 'unknown#pre_high', label: 'Inconnu / Surpression', id: [] }
  ],
  crea3: [
    { code: 'temp_high#unkown', label: 'Surchauffe / Inconnu', id: [] },
    { code: 'unknown#pre_normal', label: 'Inconnu / Pression normale', id: [] },
    { code: 'temp_normal#unknown', label: 'Chauffe normale / Inconnu', id: [] },
    { code: 'unknown#pre_high', label: 'Inconnu / Surpression', id: [] }
  ]
}

const reactorsStop = [
  { code: 'temp_high#pre_high', label: 'Surchauffe / Surpression', id: ['1'] },
  { code: 'temp_high#pre_normal', label: 'Surchauffe / Pression normale', id: ['2'] },
  { code: 'temp_normal#pre_high', label: 'Chauffe normale / Surpression', id: ['3'] },
  { code: 'temp_normal#pre_normal', label: 'Chauffe normale / Pression normale', id: ['4'] }
]
let wasonMode = 'learning'
let fusibleEnabled = false

class WasonService {
  static startWason () {
    console.log('launch wason')
    Helper.openChromium('wason.html')
  }

  static stopWason () {
    console.log('Stop wason window')
    Helper.closeChromium()
  }

  static set mode (mode) {
    console.log('setWasonMode', mode)
    wasonMode = mode
    console.log('wasonMode', wasonMode)
  }

  static disableFusible () {
    fusibleEnabled = false
  }
  static enableFusible () {
    fusibleEnabled = true
  }

  static async handleWason (socket) {
    console.log('handleWason')
    console.log('waonsMode', wasonMode)
    if (wasonMode === 'real') return WasonService.startWasonReal(socket)
    const positions = { shift: shift[config.deviceName], reactors: reactorsButtonChoice[config.deviceName] }
    socket.emit('wason-selected', positions)
    const selectedReactor1 = await WasonService.wasonLearningCycle(socket, positions)
    const selectedReactor2 = await WasonService.wasonLearningCycle(socket, positions, { previousSelectedPin: selectedReactor1 })
    await Helper.sleep(2)
    await WasonService.stopWason(socket)
  }

  static async wasonLearningCycle (socket, positions, { previousSelectedPin = null } = {}) {
    console.log('previsousSelected', previousSelectedPin)
    console.log('pins', _.pull([
      WASON_LEARING_BUTTON_1_PIN,
      WASON_LEARING_BUTTON_2_PIN,
      WASON_LEARING_BUTTON_3_PIN,
      WASON_LEARING_BUTTON_4_PIN], previousSelectedPin))
    const buttonRecord = await GpioService.buttonWasonChanged(_.pull([
      WASON_LEARING_BUTTON_1_PIN,
      WASON_LEARING_BUTTON_2_PIN,
      WASON_LEARING_BUTTON_3_PIN,
      WASON_LEARING_BUTTON_4_PIN], previousSelectedPin), true)
    const { mainServer } = require('../server')
    console.log('buttonRecord', buttonRecord)
    positions.reactors[pinToIndex[buttonRecord.channel]].selected = true
    const newPositions = { ...positions, button: pinToIndex[buttonRecord.channel], type: 'wason' }
    socket.emit('wason-selected', newPositions)
    mainServer.socket.emit('wason-selected-' + config.deviceName, newPositions)
    await Helper.sleep(0.5)
    return buttonRecord.channel
  }

  static async startWasonReal (socket) {
    WasonService.enableFusible()
    let shift = 5
    const reactors = [
      { code: 'temp_high#unkown', label: 'Surchauffe / Inconnu', id: ['A', 'B'] },
      { code: 'unknown#pre_normal', label: 'Inconnu / Pression normale', id: ['C', 'D'] },
      { code: 'unknown#pre_high', label: 'Inconnu / Surpression', id: ['E', 'F'] },
      { code: 'temp_normal#unknown', label: 'Chauffe normale / Inconnu', id: ['G', 'H'] }
    ]
    const positions = { shift, reactors }
    socket.emit('wason-selected', positions)
    const selectedReactor1 = await WasonService.wasonRealCycle(socket, positions)
    const selectedReactor2 = await WasonService.wasonRealCycle(socket, positions, { previousSelectedPin: selectedReactor1 })
    await Helper.sleep(1)
    WasonService.disableFusible()
  }

  static async wasonRealCycle (socket, positions, { previousSelectedPin = null } = {}) {
    console.log('wasonRealCycle')
    const selectedReactor = await SocketService.waitForEvent('wason-fusible')
    console.log('selectedReactor', selectedReactor)
    if (previousSelectedPin === selectedReactor) return WasonService.wasonRealCycle(socket, positions, { previousSelectedPin })
    positions.reactors[fusibleToIndex[selectedReactor]].selected = true
    const newPositions = { ...positions, selectedReactor, button: fusibleToIndex[selectedReactor], type: 'wason' }
    socket.emit('wason-selected', newPositions)
    SocketService.emitSocketMessage('wason-real-selected', newPositions)
    return selectedReactor
  }

  static async wasonStopReactorChoice () {
    let shift = 1
    const buttonRecord = await GpioService.buttonWasonChanged([
      WASON_LEARING_BUTTON_1_PIN,
      WASON_LEARING_BUTTON_2_PIN,
      WASON_LEARING_BUTTON_3_PIN,
      WASON_LEARING_BUTTON_4_PIN], true)
    const reactors = reactorsStop
    const selectedReactor = pinToIndex[buttonRecord.channel]
    reactors[selectedReactor].selected = true
    return { shift, reactors, button: selectedReactor, type: 'wason' }
  }

  static async handleFusible (pin) {
    console.log('handleFusible', pin)
    if (!fusibleEnabled) await SoundService.playAndWait('IA_fusible.mp3', 4)
  }
}

module.exports = { WasonService }
