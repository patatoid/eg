const _ = require('lodash');
const config = require('./config');
const Helper = require('./helper');
const { SocketService } = require('./socket');
const { gpio } = require('./gpio');

const WASON_LEARING_BUTTON_1_PIN = 13;
const WASON_LEARING_BUTTON_2_PIN = 15;
const WASON_LEARING_BUTTON_3_PIN = 16;
const WASON_LEARING_BUTTON_4_PIN = 18;

const reactors = [
 {label: 'Surchauffe / Surpression'},
 {label: 'Surchauffe / Pression normale'},
 {label: 'Chauffe normale / Surpression'},
 {label: 'Chauffe normale / Pression normale'},
]

const fusibleToIndex = {
  'A': 0,
  'B': 1,
  'C': 2,
  'D': 3,
}

const pinToIndex = {
  [WASON_LEARING_BUTTON_1_PIN]: 0,
  [WASON_LEARING_BUTTON_2_PIN]: 1,
  [WASON_LEARING_BUTTON_3_PIN]: 2,
  [WASON_LEARING_BUTTON_4_PIN]: 3,
}

const shift = {
  'main': 0,
  'crea1': 2,
  'crea2': 1,
  'crea3': 3,
}


Helper.declareGpioPin(WASON_LEARING_BUTTON_1_PIN, gpio.DIR_IN, gpio.EDGE_BOTH);
Helper.declareGpioPin(WASON_LEARING_BUTTON_2_PIN, gpio.DIR_IN, gpio.EDGE_BOTH);
Helper.declareGpioPin(WASON_LEARING_BUTTON_3_PIN, gpio.DIR_IN, gpio.EDGE_BOTH);
Helper.declareGpioPin(WASON_LEARING_BUTTON_4_PIN, gpio.DIR_IN, gpio.EDGE_BOTH);

let wasonMode = 'learning';

class WasonService {
  static startWason() {
    console.log('launch wason');
    Helper.openChromium('wason.html');
  }

  static stopWason() {
    console.log('Stop wason window');
    Helper.closeChromium();
  }

  static set wasonMode(mode) {
    wasonMode = mode;
  }

  static async handleWason(socket) {
    console.log('handleWason');
    if (wasonMode === 'real') return WasonService.startWasonReal(socket);
    const positions = {shift: shift[config.deviceName], reactors};
    socket.emit('wason-selected', positions);
    const selectedReactor1 = await WasonService.wasonLearningCycle(socket, positions);
    const selectedReactor2 = await WasonService.wasonLearningCycle(socket, positions, {previousSelectedPin: selectedReactor1});
    await Helper.sleep(5);
    await WasonService.stopWason(socket);
  }

  static async wasonLearningCycle(socket, positions, {previousSelectedPin = null} = {}) {
    console.log('previsousSelected', previousSelectedPin);
    const buttonRecord = await Helper.buttonWasonChanged(_.pull([
      WASON_LEARING_BUTTON_1_PIN,
      WASON_LEARING_BUTTON_2_PIN,
      WASON_LEARING_BUTTON_3_PIN,
      WASON_LEARING_BUTTON_4_PIN], previousSelectedPin), true);
    const { mainServer } = require('./server');
    console.log('buttonRecord', buttonRecord);
    positions.reactors[pinToIndex[buttonRecord.channel]].selected = true;
    const newPositions = {...positions, buttonRecord};
    socket.emit('wason-selected', newPositions);
    mainServer.socket.emit('wason-selected-'+config.deviceName, newPositions);
    await Helper.sleep(0.5);
    return buttonRecord.channel;
  }

  static async startWasonReal(socket) {
    let shift = 1;
    const positions = {shift, reactors};
    socket.emit('wason-selected', positions);
    await WasonService.wasonRealCycle(socket, positions);
    await WasonService.wasonRealCycle(socket, positions);
    await Helper.sleep(1);
  }

  static async wasonRealCycle(socket, positions) {
    const selectedReactor = await SocketService.waitForEvent('wason-fusible');
    positions.reactors[fusibleToIndex[selectedreactor]].selected = true;
    const newPositions = {...positions, selectedReactor};
    socket.emit('wason-selected', positions);
    SocketService.emitSocketMessage('wason-real-selected', positions);
  }

  static async wasonStopReactorChoice() {
    const buttonRecord = await Helper.buttonWasonChanged([
      WASON_LEARING_BUTTON_1_PIN,
      WASON_LEARING_BUTTON_2_PIN,
      WASON_LEARING_BUTTON_3_PIN,
      WASON_LEARING_BUTTON_4_PIN], true);
    return butonRecord;
  }
}

module.exports = {WasonService};
