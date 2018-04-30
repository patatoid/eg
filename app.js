const execa = require('execa');
const config = require('./config');
const CreaService = require("./crea");
const AdminService = require('./admin');
const { mainFlow, FlowService } = require('./action.service');
const { StateService, connections } = require('./state.service');
const { SocketService } = require('./socket.service');

SocketService.io.on('connection', function(socket) {
  socket.on('crea-connected', () => CreaService.handleCrea(socket));
  socket.on('start-crea', () => CreaService.startCrea(socket));
  socket.on('crea-record', (record) => AdminService.saveCreaRecord(record));
  socket.on('identification', id => {
    connections.setState(id, true);
    if(id === 'interface') SocketService.io.emit('mainFlow', mainFlow);
    socket.on("begin", () => SocketService.emitSocketMessage('begin'));
    socket.on("force", () => SocketService.emitSocketMessage('force'));
    socket.on('disconnect', () => connections.setState(id, false));
  })
});

setTimeout(() => FlowService.executePromises(mainFlow)
  .catch(error => console.log('error !', error)), 1000);
