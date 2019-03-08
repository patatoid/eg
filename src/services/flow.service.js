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
    }]),
    new FlowService('Moore session', [{
      name: 'redNucleaAppear',
      description: 'Premier glitch',
      force: actionService.can('redNucleaAppear') && 'redNucleaAppear'
    }, {
      name: 'openMooreSession',
      description: 'Session de Moore',
      force: actionService.can('openMooreSession') && 'openMooreSession'
    }]),
    new FlowService('End', [{
      name: 'startKeys',
      description: "Mets en attente d'insertion des clefs",
      force: actionService.can('startKeys') && 'startKeys'
    }, {
      name: 'insertKey1',
      description: "Clef 1 insérée",
      force: actionService.can('insertKey1') && 'insertKey1'
    }, {
      name: 'insertKey2',
      description: "Clef 2 insérée",
      force: actionService.can('insertKey2') && 'insertKey2'
    }, {
      name: 'insertKey3',
      description: "Clef 3 insérée",
      force: actionService.can('insertKey3') && 'insertKey3'
    }, {
      name: 'insertKey4',
      description: "Clef 4 insérée",
      force: actionService.can('insertKey4') && 'insertKey4'
    }])
  ]
}

module.exports = {
  FlowService
}
