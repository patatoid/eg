const { mainFlow } = require('./action.service');
let AdminPanelSocket = null;
const CreaRecords = [];

module.exports = class AdminService {
  static async saveCreaRecord(record) {
    CreaRecords.push(record);
    AdminService.sendRecords();
  }

  static async sendRecords() {
    if(!AdminPanelSocket) return;
    AdminPanelSocket.emit('crea-records', CreaRecords);
  }
}

