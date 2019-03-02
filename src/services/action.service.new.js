const StateMachine = require('javascript-state-machine')
const Helper = require('../helper')

class ActionService {
  constructor () {
    this.stateMachine = new StateMachine({
      init: 'initial',
      transitions: [
        { name: 'boot', from: 'initial', to: 'ready' }
      ],
      methods: {
        onBoot () {
          Helper.openChromium('new/index.html', { cursor: true })
        }
      }
    })
  }

  trigger (action) {
    this.stateMachine[action]()
  }
}

module.exports = new ActionService()
