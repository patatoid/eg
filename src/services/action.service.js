const Helper = require('../helper')
const SoundService = require('./sound.service')
const DeviceService = require('./device.service')
const { mainServer } = require('../server')
const { SocketService } = require('./socket.service')
const { WasonService } = require('./wason.service')
const words = require('../config/words')

const ACTION_STATE = {
  PENDING: 'pending',
  STARTED: 'started',
  FINISHED: 'finished'
}

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
      await action.execute()
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

class ActionService {
  constructor (action, description, { force = false } = {}) {
    this.action = action
    this.description = description
    this.state = ACTION_STATE.PENDING
    this.force = force
    this.response = null
    this.startTime = null
  }

  async execute () {
    this.startTime = Date.now()
    this.changeState(ACTION_STATE.STARTED)
    this.response = await Promise.race([this.action(), SocketService.waitForEvent('force')])
    console.log('this.response', this.response)
    this.changeState(ACTION_STATE.FINISHED)
  }

  changeState (state) {
    this.state = state
    SocketService.io.emit('mainFlow', mainFlow)
  }
}

const generateCreaActions = () => {
  const devices = Object.keys(words)
  return devices.map(device => {
    const deviceWords = words[device]
    const actions = deviceWords.map(word =>
      new ActionService(() => SocketService.waitForEvent('crea-record-' + device), word[0]))
    return new FlowService(`ordinateur ${device}`, actions)
  })
}

const generateWasonTrainingActions = () => {
  const devices = ['main', 'crea1', 'crea2', 'crea3']
  return devices.map(device => {
    const deviceButton = [1, 2]
    const actions = deviceButton.map(button => new ActionService(() => SocketService.waitForEvent('wason-selected-' + device), 'button' + button))
    return new FlowService(`ordinateur ${device}`, actions)
  })
}

let finalReactorChoice = null

const mainFlow = [
  new FlowService('Reset Etat', [
    new ActionService(() => DeviceService.off(DeviceService.MAGNET_LOCK), 'deverouillage porte'),
    new ActionService(() => DeviceService.off(DeviceService.MAGNET_LOCK), 'deverouillage porte (securite)'),
    new ActionService(() => DeviceService.on(DeviceService.GLOBAL_LIGHT), 'Allumage lumière globale'),
    new ActionService(() => DeviceService.off(DeviceService.GYRO), 'Eteindre gyro'),
    new ActionService(() => DeviceService.on(DeviceService.MAGNET_ENTRANCE), 'maintient porte ouverte'),
    new ActionService(() => DeviceService.off(DeviceService.MAGNET_CLOSET_1), 'Ouverture placard 1'),
    new ActionService(() => DeviceService.off(DeviceService.MAGNET_CLOSET_2), 'Ouverture placard 2'),
    new ActionService(() => (SocketService.io.emit('restart'), SocketService.io.emit('counter-reset'), null), 'Redemarrage des autres services')
  ]),
  new FlowService('Setup', [
    new ActionService(() => Helper.wait(), 'Attente manipulation du game master', { force: 'Effectué' }),
    new ActionService(() => DeviceService.on(DeviceService.MAGNET_CLOSET_1), 'verrouillage placard 1'),
    new ActionService(() => DeviceService.on(DeviceService.MAGNET_CLOSET_2), 'verrouillage placard 2')
  ]),
  new FlowService('Mise en situation', [
    new ActionService(() => Helper.wait(), 'Attente demarrage', { force: 'Demarrer' }),
    new ActionService(() => DeviceService.off(DeviceService.MAGNET_ENTRANCE), 'fermeture porte'),
    new ActionService(() => DeviceService.on(DeviceService.MAGNET_LOCK), 'verouillage porte'),
    new ActionService(() => Helper.sleep(2), '2s fermeture porte'),
    new ActionService(() => DeviceService.off(DeviceService.GLOBAL_LIGHT), 'extinction lumière globale'),
    new ActionService(() => DeviceService.on(DeviceService.GYRO), 'Allumage gyro'),
    new ActionService(() => (SocketService.io.emit('counter-start'), null), 'Demarrage compteur'),
    new ActionService(() => (SocketService.io.emit('screen', 'berserk'), null), 'Ecrans berserk'),
    new ActionService(() => SoundService.playAndWait(SoundService.siren, 10), 'sirene 10s'),
    new ActionService(() => SoundService.playAndWait('IA_security_protocol.mp3', 4), 'IA demarrage protocole sécurité')
  ]
  ),
  new FlowService('Enigme Elec', [
    new ActionService(() => SocketService.waitForEvent('elec-breaker-on'), 'En attente manipulation coffret electrique joueur'),
    new ActionService(() => (SocketService.io.emit('screen', 'elec_restored'), null), 'Ecrans backup generator restored'),
    new ActionService(() => DeviceService.on(DeviceService.GLOBAL_LIGHT), 'rallumage lumière globale'),
    new ActionService(() => DeviceService.off(DeviceService.GYRO), 'Extinction gyro'),
    new ActionService(() => SoundService.playAndWait('IA_light.mp3', 9), 'IA parle bizarrement')
  ]
  ),
  new FlowService('Enigme Crea', [
    new ActionService(() => (SocketService.io.emit('start-crea'), null), 'Demarrage des processus pour enigme Crea'),
    new ActionService(() => true, 'IA debut crea avec explications ou explications sur écran ?'),
    new ActionService(() => SocketService.waitForEvent('crea-connected'), 'Crea démarré'),
    new FlowService('Resultats', generateCreaActions(), ACTION_TYPE.PARALLEL),
    new ActionService(() => DeviceService.off(DeviceService.MAGNET_CLOSET_1), 'Ouverture placard 1'),
    new ActionService(() => SoundService.playAndWait('IA_placard.mp3', 3), 'IA placard dévérouillé'),
    new ActionService(() => SoundService.playAndWait('IA_analyse_in_progress.mp3', 6), 'IA crea terminé, analyse probleme')
  ]
  ),
  new FlowService('Enigme Base de donnée et ordi central', [
    new ActionService(() => Helper.openChromium('roger.html', { cursor: true }), 'Allumage ecran Roger Moore sur identifiant de connection'),
    new ActionService(() => SocketService.waitForEvent('session-opened'), 'En attente dévérouillage session')
  ]
  ),
  new FlowService('Enigme Wason entrainement', [
    new ActionService(() => Helper.wait(), 'Attente déclenchement par Game Master', { force: 'Déclencher' }),
    new ActionService(() => Helper.closeChromium(), 'extinction ecran roger'),
    new ActionService(() => Helper.sleep(3), 'pause 3s'),
    new ActionService(() => (WasonService.mode = 'training', SocketService.io.emit('start-wason-training'), null), 'Demarrage des processus pour enigme wason entrainement'),
    new ActionService(() => SocketService.waitForEvent('wason-connected'), 'processus démarrés'),
    new ActionService(() => SoundService.playAndWait('IA_training_begin.mp3', 6), 'IA la procédure d\'entrainement va commencer'),
    new FlowService('Resultats', generateWasonTrainingActions(), ACTION_TYPE.PARALLEL),
    new ActionService(() => DeviceService.off(DeviceService.MAGNET_CLOSET_2), 'Ouverture placard 2'),
    new ActionService(() => SoundService.playAndWait('IA_placard.mp3', 3), 'IA placard dévérouillé')
  ]
  ),
  new FlowService('Enigme 4 clés', [
    new ActionService(() => SocketService.waitForEvent('keys-inserted'), 'Attente insertion 4 clés')
  ]
  ),
  new FlowService('Enigme Wason', [
    new ActionService(() => (WasonService.mode = 'real', Helper.openChromium('wason.html')), 'Demarrage processus wason réel'),
    new ActionService(() => SocketService.waitForEvent('wason-connected'), 'processus démarrés'),
    new ActionService(() => SocketService.waitForEvent('wason-real-selected'), 'Attente insertion fusible 1'),
    new ActionService(() => SocketService.waitForEvent('wason-real-selected'), 'Attente insertion fusible 2'),
    new ActionService(() => Helper.sleep(3), 'pause 3s')
  ]),
  new FlowService('Extinction réacteur', [
    new ActionService(() => (SocketService.io.emit('wason-animation'), null), 'Affichage de l\'animation reacteurs'),
    new ActionService(() => SoundService.playAndWait('IA_wason_end.mp3', 7), 'IA quel reacteur éteindre ?'),
    new ActionService(async () => finalReactorChoice = await WasonService.wasonStopReactorChoice(), 'Choix bouton stop reacteur'),
    new FlowService('Fin', [
      new FlowService('Ouverture porte', [
        new ActionService(() => (SocketService.io.emit('counter-end'), null), 'Arret compteur'),
        new ActionService(() => DeviceService.off(DeviceService.MAGNET_LOCK), 'deverouillage porte'),
        new ActionService(() => DeviceService.off(DeviceService.MAGNET_LOCK), 'deverouillage porte (securite)'),
        new ActionService(() => DeviceService.on(DeviceService.MAGNET_ENTRANCE), 'maintient porte ouverte')
      ]),
      new FlowService('IA succés', [
        new ActionService(() => Helper.predicate(finalReactorChoice.button === 0), 'continue si reacteur = 1 '),
        new ActionService(() => SoundService.playAndWait('IA_end_good.mp3', 6), 'IA succés. End')
      ]),
      new FlowService('IA echec', [
        new ActionService(() => Helper.predicate(finalReactorChoice.button !== 0), 'continu si reacteur != 1'),
        new ActionService(() => Helper.closeChromium(), 'extinction ecran'),
        new ActionService(() => SoundService.playAndWait('IA_end_bad.mp3', 4), 'IA echec. End'),
        new ActionService(() => Helper.sleep(2), 'pause 2s'),
        new ActionService(() => DeviceService.off(DeviceService.GLOBAL_LIGHT), 'extinction lumière globale'),
        new ActionService(() => DeviceService.on(DeviceService.GYRO), 'Allumage gyro')
      ])
    ], ACTION_TYPE.PARALLEL_RACE)
  ])
]

module.exports = {
  ActionService,
  FlowService,
  mainFlow
}
