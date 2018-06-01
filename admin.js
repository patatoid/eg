const { mainFlow } = require('./action.service');
const { SocketService } = require('./socket.service');
const { app } = require('./server');
let AdminPanelSocket = null;
const creaRecords = {};

app.get('/crea-audio/:key', (req, res)=> {
console.log('params', req.params);
res.setHeader('content-type', 'audio/wav');
res.send(creaRecords[req.params.key]);
})
class AdminService {
  static async saveCreaRecord(record) {
    creaRecords[`${record.deviceName}_${record.index}`] = record.data;
  }
}
module.exports = {
  AdminService,
  creaRecords
}
