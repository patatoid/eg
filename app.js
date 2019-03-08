const { mainServer } = require('./src/server')
const actionService = require('./src/services/action.service.new')
const { io } = require('./src/server');
const { connections } = require('./src/services/state.service');
const { FlowService } = require('./src/services/flow.service');
const { GpioService } = require('./src/services/gpio.service');
const { CreaService } = require('./src/services/crea.service');
const { SequenceService } = require('./src/services/sequence.service');
const { deviceName } = require('./src/config/config')
const config = require('./src/config/config')

start()

async function start () {

  const mainFlow = await FlowService.setup()
  const deviceSocket = {}

  io.on('connection', function(socket) {
    socket.join('all')
    socket.on('identification', id => {
      if(id === 'interface') socket.emit('mainFlow', mainFlow);
      if (['crea1', 'crea2', 'crea3'].filter((device) => device === id)[0]) socket.join('satelite')
      if (['main'].filter((device) => device === id)[0]) socket.join('main')
      if (['interface'].filter((device) => device === id)[0]) socket.join('interface')

      socket.on('disconnect', () => connections.setState(id, false));
      connections.setState(id, true);
      Object.assign(deviceSocket, { [id]: socket })
    });
    socket.on('trigger', actionName => {
      triggerAction(actionName)
    })
    // TODO move that in action service
    socket.on('elec-breaker-on', () => {
      triggerAction('lightOn')
    })
    socket.on('creativity-training-end', () => {
      triggerAction('startCreativityTask')
    })
    socket.on('creativity-task-end', () => {
      const allEnded = Object.keys(deviceSocket).map((device) => {
        const currentSocket = deviceSocket[device]
        if (currentSocket.id === socket.id) {
          Object.assign(currentSocket, { creativityTaskEnded: true })
        }
        return device
      }).filter((device) => {
        if (['crea1', 'crea2', 'crea3', 'main'].some((e) => e === device)) return device
      }).every((device) => {
        if (!device) return true
        return deviceSocket[device].creativityTaskEnded
      })

      if (allEnded) {
        triggerAction('endCreativityTask')
        Object.keys(deviceSocket).forEach((device) => {
          Object.assign(deviceSocket[device], { creativityTaskEnded: false })
        })
      }
    })
    socket.on('creativity-trial-recording', ({ deviceName, data }) => {
      io.to(deviceSocket[deviceName].id).emit('creativity-trial-recording')
    })
    socket.on('creativity-trial-answer', ({ deviceName, data }) => {
      io.to(deviceSocket[deviceName].id).emit('next-creativity-trial')
    })
    socket.on('sequence-answer', ({ deviceName, data }) => {
      io.in('all').emit('open-first-glitch')
    })
  })

  mainServer.socket.on('start-creativity-task', () => {
    CreaService.startCrea()
  })

  if(config.deviceName === 'crea1' || config.deviceName === 'crea3') {
    mainServer.socket.on('start-sequence', () => {
      SequenceService.start()
    })
  }

  async function triggerAction (actionName) {
    mainFlow.forEach((flow) => {
      flow.actions.forEach((action) => {
        if (action.name === actionName) {
          action.state = 'started'
          action.startTime = Date.now()
          action.force = false
        }
      })
    })
    io.emit('mainFlow', mainFlow)
    await actionService.trigger(actionName, mainFlow)
    mainFlow.forEach((flow) => {
      flow.actions.forEach((action) => {
        if (action.name === actionName) {
          action.state = 'finished'
        }
        action.force = actionService.can(action.name) && action.name
      })
    })
    io.emit('mainFlow', mainFlow)
  }
}
