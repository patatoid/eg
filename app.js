const execa = require('execa');
const config = require('./config');
const AdminService = require('./admin');
const Helper = require('./helper');
const { SocketService } = require('./socket.service');
const { CreaService } = require('./crea');
const { StateService, connections } = require('./state.service');
const { mainFlow, FlowService } = require('./action.service');
const { mainServer } = require('./server');

SocketService.io.on('connection', function(socket) {
  socket.on('crea-record', (record) => {
    SocketService.emitSocketMessage('crea-record');
    return AdminService.saveCreaRecord(record);
  });
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
  mainServer.socket.emit('identification', process.env.DEVICE_NAME);
});
mainServer.socket.on('screen', (type) => {
  if (type === 'berserk' ) {
    Helper.launchProcess('scripts/berserk.sh');
  }
})
mainServer.socket.on('start-crea', () => CreaService.startCrea());

setTimeout(() => FlowService.executePromises(mainFlow)
  .catch(error => console.log('error !', error)), 1000);
