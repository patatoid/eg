const { mainServer } = require('./src/server')
const actionService = require('./src/services/action.service.new')
const { io } = require('./src/server');
const { connections } = require('./src/services/state.service');
const { FlowService } = require('./src/services/flow.service');

start()

async function start () {

  const mainFlow = await FlowService.setup()

  io.on('connection', function(socket) {
    socket.join('all')
    socket.on('identification', id => {
      if(id === 'interface') socket.emit('mainFlow', mainFlow);
      if (['crea1', 'crea2', 'crea3'].filter((device) => device === id)[0]) socket.join('satellite')
      if (['main'].filter((device) => device === id)[0]) socket.join('main')
      if (['interface'].filter((device) => device === id)[0]) socket.join('interface')

      socket.on('disconnect', () => connections.setState(id, false));
      connections.setState(id, true);
    });
    socket.on('trigger', actionName => {
      triggerAction(actionName)
    })
    // TODO move that in action service
    socket.on('elec-breaker-on', () => {
      actionService.trigger('trainCreativity')
    })
  })

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
