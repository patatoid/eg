let AdminPanelSocket = null;
const CreaRecords = [];

module.exports = class AdminService {

  static async startAdmin(socket) {
  console.log('startAdmin');
    AdminPanelSocket = socket;
    AdminService.sendRecords();
  }

  static async stopAdmin() {
    AdminPanelSocket = null;
  }

  static async saveCreaRecord(record) {
    CreaRecords.push(record);
    AdminService.sendRecords();
  }

  static async sendRecords() {
    if(!AdminPanelSocket) return;
    AdminPanelSocket.emit('crea-records', CreaRecords);
  }
}

