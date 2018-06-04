const execa = require('execa');
const { gpio } = require('./gpio');
const config = require('./config');
const { AdminService } = require('./admin');
const Helper = require('./helper');
const { SocketService } = require('./socket.service');
const { CreaService } = require('./crea');
const { WasonService } = require('./wason');
const { StateService, connections } = require('./state.service');
const { mainFlow, FlowService } = require('./action.service');
const { mainServer } = require('./server');
const { KeysService } = require('./keys');

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
  socket.on('key', (index) => {
    KeysService.saveKey(index);
  });
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
  })
});


mainServer.socket.on('connect', () => {
  mainServer.socket.emit('identification', config.deviceName);
});
mainServer.socket.on('screen', (type) => {
  Helper.launchProcess(['sh', [`./scripts/${type}.sh`]]);
})
mainServer.socket.on('start-crea', () => CreaService.startCrea());
mainServer.socket.on('start-wason-training', () => WasonService.startWason());


if(config.deviceName === 'elec') {
  const ELEC_TRIGGER_PIN = 11;
  Helper.declareGpioPin(ELEC_TRIGGER_PIN, gpio.DIR_IN, gpio.EDGE_BOTH);
 console.log('declare pin');
  Helper.listenOnChange((pin, state)=> {
    if(pin === ELEC_TRIGGER_PIN) {
      if(state) {
	console.log('elec-breaker-on');
        mainServer.socket.emit('elec-breaker-on');
      }
    }
  })
}

if(config.deviceName === 'crea1' || config.deviceName === 'crea3') {
  const KEY_1 = 5;
  const KEY_2 = 6;
  const pinToKeyNumber = {
    [KEY_1]: 1,
    [KEY_2]: 2,
  }
  Helper.declareGpioPin(KEY_1, gpio.DIR_IN, gpio.EDGE_BOTH);
  Helper.declareGpioPin(KEY_2, gpio.DIR_IN, gpio.EDGE_BOTH);
  Helper.listenOnChange((pin, state)=> {
    if(pin === KEY_1 || pin === KEY_2) {
      if(state) {
        console.log(`key-${config.deviceName}-${pinToKeyNumber[pin]}-on`);
        mainServer.socket.emit(`key-${config.deviceName}-${pinToKeyNumber[pin]}-on`);
      }
    }
  })
}

if(!config.deviceName) {
  console.log('you have to specify a device name ! ');
  process.exit(1)
}

if(config.deviceName === 'main') {
setTimeout(() => FlowService.executePromises(mainFlow.slice(0))
  .catch(error => console.log('error !', error)), 1000);
}
