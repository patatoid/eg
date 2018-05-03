const { mainFlow } = require('./action.service');
const { SocketService } = require('./socket.service');
let AdminPanelSocket = null;
const CreaRecords = {};

module.exports = class AdminService {
  static async saveCreaRecord(record) {
    CreaRecords[`${record.deviceName}_${record.index}`] = record.data;
  }
}

