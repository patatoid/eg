const { io } = require('./server');
const EventEmitter = require('events');
const socketListener = new EventEmitter();
socketListener.setMaxListeners(50);

class SocketService {
  static get io() {
    return io;
  }

  static emitSocketMessage(message, data) {
    socketListener.emit(message, data);
  }

  static async waitForEvent(name) {
    return new Promise((resolve, reject) => {
      socketListener.once(name, (data) => resolve(data));
    })
  }
}

module.exports = { SocketService }
