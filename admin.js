const { mainFlow } = require('./action.service');
const { SocketService } = require('./socket.service');
let AdminPanelSocket = null;
const CreaRecords = [];

module.exports = class AdminService {
  static async saveCreaRecord(record) {
  console.log('record', record);
    CreaRecords.push(record);
    SocketService.io.emit('crea-record', record);
  }
}

