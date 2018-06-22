const EventEmitter = require('events');
const { io } = require('./server');
const { app } = require('./server');
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


app.get('/socket/:message/:data', function(req, res) {
  SocketService.emitSocketMessage(req.params.message, req.params.data);
  res.send('ok socket');
})

module.exports = { SocketService }
