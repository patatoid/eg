const { mainServer } = require('./src/server')
const actionService = require('./src/services/action.service.new')

actionService.trigger('boot')
