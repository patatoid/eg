const execa = require('execa');
const { gpio } = require('./gpio');
const config = require('./config');
const AdminService = require('./admin');
const Helper = require('./helper');
const { SocketService } = require('./socket.service');
const { CreaService } = require('./crea');
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
  const transfere = (message) => socket.on(message, () => SocketService.emitSocketMessage(message));
  creaReacordSave(socket, 'crea-record-main');
  creaReacordSave(socket, 'crea-record-crea1');
  creaReacordSave(socket, 'crea-record-crea2');
  creaReacordSave(socket, 'crea-record-crea3');
  transfere('force');
  transfere('session-opened');
  transfere('keys-inserted');
  transfere('elec-breaker-on');
  socket.on('key', (index) => {
    KeysService.saveKey(index);
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


if(config.deviceName === 'elec') {
  const ELEC_TRIGGER_PIN = 37;
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

setTimeout(() => FlowService.executePromises(mainFlow)
  .catch(error => console.log('error !', error)), 1000);
