const _ = require('lodash');
const config = require('./config');
const Helper = require('./helper');
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

class WasonService {
  static startWason() {
    console.log('launch wason');
    Helper.openChromium('wason.html');
  }

  static stopWason() {
    console.log('Stop wason window');
    Helper.closeChromium();
  }

  static async handleWasonLearning(socket) {
    console.log('handleWasonLearning');
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
    socket.emit('wason-selected', positions);
    mainServer.socket.emit('wason-selected-'+config.deviceName, positions);
    await Helper.sleep(0.5);
    return buttonRecord.channel;
  }
}

module.exports = {WasonService};
