const _ = require('lodash');
const execa = require('execa');
const gpio = require('rpi-gpio');
const { GpioService } = require('./src/services/gpio.service');
const config = require('./src/config/config');
const { AdminService } = require('./src/services/admin.service');
const Helper = require('./src/helper');
const { SocketService } = require('./src/services/socket.service');
const { CreaService } = require('./src/services/crea.service');
const { WasonService } = require('./src/services/wason.service');
const { StateService, connections } = require('./src/services/state.service');
const { mainFlow, FlowService } = require('./src/services/action.service');
const { mainServer } = require('./src/server');
const { KeysService } = require('./src/config/keys');

const creaReacordSave = (socket, name) => {
  socket.on(name, (record) => {
  const recordToEmit = {type:'crea', deviceName: record.deviceName, index: record.index, hasData: !!record.data, duration: record.duration};
    console.log('recordToEmit', recordToEmit)
    SocketService.emitSocketMessage(name, recordToEmit);
    return AdminService.saveCreaRecord(record);
  });
}

SocketService.io.on('connection', function(socket) {
console.log('connection');
  const transfere = (message) => socket.on(message, (data) => SocketService.emitSocketMessage(message, data));
  creaReacordSave(socket, 'crea-record-main');
  creaReacordSave(socket, 'crea-record-crea1');
  creaReacordSave(socket, 'crea-record-crea2');
  creaReacordSave(socket, 'crea-record-crea3');
  transfere('force');
  transfere('session-opened');
  transfere('keys-inserted');
  transfere('elec-breaker-on');
  transfere('wason-selected-main');
  transfere('wason-selected-crea1');
  transfere('wason-selected-crea2');
  transfere('wason-selected-crea3');
  transfere('wason-fusible');
  socket.on('key', (index) => {
    KeysService.saveKey(index);
  });
  socket.on('wason-fusible', (pin) => WasonService.handleFusible(pin));
  socket.on('wason-connected', () => {
  console.log('wason-connected');
    SocketService.emitSocketMessage('wason-connected');
    return WasonService.handleWason(socket);
  });
  socket.on('crea-connected', () => {
    SocketService.emitSocketMessage('crea-connected');
    return CreaService.handleCrea(socket);
  });
  socket.on('identification', id => {
    connections.setState(id, true);
    if(id === 'interface') SocketService.io.emit('mainFlow', mainFlow);
    socket.on('disconnect', () => connections.setState(id, false));
  });
  socket.on('restart-game', () => process.exit(0));
  socket.on('shutdown', () => SocketService.io.emit('shutdown'));
});


mainServer.socket.on('connect', () => {
  mainServer.socket.emit('identification', config.deviceName);
});
mainServer.socket.on('shutdown', () => {
console.log('shutdown');
  Helper.launchProcess(['sudo', ['shutdown', '-h', 'now']]);
});
mainServer.socket.on('restart', () => {
  Helper.closeChromium();
  if(config.deviceName !== 'main') process.exit(0);
});
mainServer.socket.on('screen', (type) => {
  Helper.launchProcess(['sh', [`./scripts/${type}.sh`]]);
})
mainServer.socket.on('start-crea', () => CreaService.startCrea());
mainServer.socket.on('start-wason-training', () => WasonService.startWason());


if(config.deviceName === 'elec') {
  const ELEC_TRIGGER_PIN = 11;
  const FUSIBLE_1=12;
  const FUSIBLE_2=15;
  const FUSIBLE_3=16;
  const FUSIBLE_4=13;

  GpioService.declareGpioPin(ELEC_TRIGGER_PIN, gpio.DIR_IN, gpio.EDGE_RISING);
  GpioService.declareGpioPin(FUSIBLE_1, gpio.DIR_IN, gpio.EDGE_RISING);
  GpioService.declareGpioPin(FUSIBLE_2, gpio.DIR_IN, gpio.EDGE_RISING);
  GpioService.declareGpioPin(FUSIBLE_3, gpio.DIR_IN, gpio.EDGE_RISING);
  GpioService.declareGpioPin(FUSIBLE_4, gpio.DIR_IN, gpio.EDGE_RISING);
  GpioService.listenOnChange((pin, state)=> {
    if(pin === ELEC_TRIGGER_PIN && state) {
        console.log('elec-breaker-on');
        mainServer.socket.emit('elec-breaker-on');
     } else if(_.includes([FUSIBLE_1, FUSIBLE_2, FUSIBLE_3, FUSIBLE_4], pin)) {
       if(state) {
          console.log('wason-fusible', pin);
          mainServer.socket.emit('wason-fusible', pin);
       }
     }
  })
}

if(config.deviceName === 'crea1' || config.deviceName === 'crea3') {
  const KEY_1=29;
  const KEY_2=31;
  const pinToKeyNumber = {
    [KEY_1]: 1,
    [KEY_2]: 2,
  }
  GpioService.declareGpioPin(KEY_1, gpio.DIR_IN, gpio.EDGE_BOTH);
  GpioService.declareGpioPin(KEY_2, gpio.DIR_IN, gpio.EDGE_BOTH);
  GpioService.listenOnChange((pin, state)=> {
    if(pin === KEY_1 || pin === KEY_2) {
      if(!state) {
        const startIndex = (config.deviceName==='crea1') ? 0 : 2;
        const keyNumber = startIndex + pinToKeyNumber[pin];
        console.log('key', keyNumber);
        mainServer.socket.emit('key', keyNumber);
      }
    }
  })
}

if (config.deviceName === 'counter') {
  setTimeout(() => Helper.launchProcess(['sh', ['./scripts/start-chromium.sh', `http://${config.mainServer}:3000/counter.html`, '-nocursor']]), 3000);
}

if(!config.deviceName) {
  console.log('you have to specify a device name ! ');
  process.exit(1)
} else {
  Helper.closeChromium();
  setInterval(() => Helper.launchProcess(['xset', ['-dpms', '-display', ':0']]), 60000);
}

if(config.deviceName === 'main') {
setTimeout(() => FlowService.executePromises(mainFlow.slice(0))
  .catch(error => console.log('error !', error)), 1000);
}
