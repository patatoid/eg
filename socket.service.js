const { io } = require('./server');
const EventEmitter = require('events');
const socketListener = new EventEmitter();

class SocketService {
  static get io() {
    return io;
  }

  static emitSocketMessage(message) {
    socketListener.emit(message);
  }

  static async waitForEvent(name) {
    return new Promise((resolve, reject) => {
      socketListener.once(name, () => resolve());
    })
  }
}

module.exports = { SocketService }
