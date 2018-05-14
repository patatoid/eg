const execa = require('execa');
const config = require('./config');
const AdminService = require('./admin');
const Helper = require('./helper');
const { SocketService } = require('./socket.service');
const { CreaService } = require('./crea');
const { StateService, connections } = require('./state.service');
const { mainFlow, FlowService } = require('./action.service');
const { mainServer } = require('./server');

const creaReacordSave = (socket, name) => {
  socket.on(name, (record) => {
  const recordToEmit = {type:'crea', deviceName: record.deviceName, index: record.index, hasData: !!record.data};
    console.log('recordToEmit', recordToEmit)
    SocketService.emitSocketMessage(name, recordToEmit);
    return AdminService.saveCreaRecord(record);
  });
}

SocketService.io.on('connection', function(socket) {
  creaReacordSave(socket, 'crea-record-main');
  creaReacordSave(socket, 'crea-record-crea1');
  creaReacordSave(socket, 'crea-record-crea2');
  creaReacordSave(socket, 'crea-record-crea3');
  socket.on('crea-connected', () => {
    SocketService.emitSocketMessage('crea-connected');
    return CreaService.handleCrea(socket);
  });
  socket.on("begin", () => SocketService.emitSocketMessage('begin'));
  socket.on("force", () => SocketService.emitSocketMessage('force'));
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
  if (type === 'berserk' ) {
    Helper.launchProcess(['sh', ['./scripts/berserk.sh']]);
  }
})
mainServer.socket.on('start-crea', () => CreaService.startCrea());

console.log(mainFlow);
setTimeout(() => FlowService.executePromises(mainFlow)
  .catch(error => console.log('error !', error)), 1000);
