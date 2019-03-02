const { SocketService } = require('./socket.service')

const connectionsDefaultState = {
  'main': false,
  'crea1': false,
  'crea2': false,
  'crea3': false,
  'elec': false,
  'counter': false,
  'interface': false
}

class StateService {
  constructor (socketName, defaultState = {}) {
    this.socketName = socketName
    this.state = defaultState
  }

  setState (key, value) {
    this.state[key] = value
    console.log('state changed', key, value)
    SocketService.io.emit(this.socketName, this.state)
  }

  getState (key, value) {
    return this.state[key]
  }

  getAll () {
    return this.state
  }
}

module.exports = {
  StateService,
  connections: new StateService('connections', connectionsDefaultState)
}
