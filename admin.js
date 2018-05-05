const { mainFlow } = require('./action.service');
const { SocketService } = require('./socket.service');
const { app } = require('./server');
let AdminPanelSocket = null;
const CreaRecords = {};

app.get('/crea-audio/:key', (req, res)=> {
console.log('params', req.params);
res.setHeader('content-type', 'audio/wav');
res.send(CreaRecords[req.params.key]);
})
module.exports = class AdminService {
  static async saveCreaRecord(record) {
    CreaRecords[`${record.deviceName}_${record.index}`] = record.data;
  }
}

