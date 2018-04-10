let AdminPanelSocket = null;
const CreaRecords = [];

module.exports = class AdminServices {

  static async startAdmin(socket) {
  console.log('startAdmin');
    AdminPanelSocket = socket;
    AdminServices.sendRecords();
  }

  static async stopAdmin() {
    AdminPanelSocket = null;
  }

  static async saveCreaRecord(record) {
    console.log('ShowCreaRecord', record);
    CreaRecords.push(record);
    AdminServices.sendRecords();
  }

  static async sendRecords() {
    if(!AdminPanelSocket) return;
    AdminPanelSocket.emit('crea-records', CreaRecords);
  }
}

