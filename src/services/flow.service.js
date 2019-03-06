const actionService = require('./action.service.new')

const ACTION_TYPE = {
  SERIE: 'serie',
  PARALLEL: 'parallel',
  PARALLEL_RACE: 'parallel_race'
}

class FlowService {
  constructor (description, actions, type = ACTION_TYPE.SERIE) {
    this.description = description
    this.actions = actions
    this.type = type
  }

  static async executePromises (actions) {
    for (let action of actions) {
      await actionService[action.name]()
    }
  }
  async execute () {
    if (this.type === ACTION_TYPE.SERIE) {
      await FlowService.executePromises(this.actions)
    } else if (this.type === ACTION_TYPE.PARALLEL) {
      await Promise.all(this.actions.map(action => action.execute()))
    } else if (this.type === ACTION_TYPE.PARALLEL_RACE) {
      await Promise.race(this.actions.map(action => action.execute()))
    }
  }
}

FlowService.setup = async () => {
  await actionService.trigger('boot')

  return [
    new FlowService('Reset Etat', [{
      name: 'restart',
      description: 'Redémarrage des services',
      force: actionService.can('restart') && 'restart'
    }]),
    new FlowService('Start', [{
      name: 'start',
      description: "Démarrage de l'escape game",
      force: actionService.can('start') && 'start'
    }]),
    new FlowService('Darkness', [{
      name: 'darkness',
      description: 'Faire sauter le disjoncteur',
      force: actionService.can('darkness') && 'darkness'
    }, {
      name: 'lightOn',
      description: 'Allumage des lumières',
      force: actionService.can('lightOn') && 'lightOn'
    }]),
    new FlowService('Creativity training', [{
      name: 'trainCreativity',
      description: 'Entrainement à la créativité',
      force: actionService.can('trainCreativity') && 'trainCreativity'
    }]),
    new FlowService('Creativity task', [{
      name: 'startCreativityTask',
      description: 'Tâche de créativité',
      force: actionService.can('startCreativityTask') && 'startCreativityTask'
    }])
  ]
}

module.exports = {
  FlowService
}
