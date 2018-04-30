const { io } = require('./server');

class SocketService {
  static get io() {
    return io;
  }

  static async waitForEvent(name) {
    return new Promise((resolve, reject) => {
      io.once(name, () => resolve());
    })
  }
}

module.exports = { SocketService }
