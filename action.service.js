const Helper = require('./helper');
const SoundService = require('./sound.service');
const DeviceService = require('./device.service');
const { mainServer } = require('./server');
const { SocketService } = require('./socket.service');
const words = require('./words');

const ACTION_STATE = {
  PENDING: 'pending',
  STARTED: 'started',
  FINISHED: 'finished'
}

const ACTION_TYPE = {
  SERIE: 'serie',
  PARALLEL: 'parallel'
}


class FlowService {
 constructor(description, actions, type=ACTION_TYPE.SERIE) {
  this.description = description;
  this.actions = actions;
  this.type = type;
 }

 static async executePromises(actions) {
  for (let action of actions) {
    await action.execute();
  }
 }
 async execute() {
  if(this.type === ACTION_TYPE.SERIE) {
   await FlowService.executePromises(this.actions);
  } else if( this.type === ACTION_TYPE.PARALLEL) {
   await Promise.all(this.actions.map(action => action.execute()));
  }
 }
}

class ActionService {
  constructor(action, description) {
    this.action = action;
    this.description = description;
    this.state = ACTION_STATE.PENDING;
    this.response = null;
  }

  async execute() {
    this.changeState(ACTION_STATE.STARTED);
    this.response = await this.action();
    console.log('this.response', this.response);
    this.changeState(ACTION_STATE.FINISHED);
  }

  changeState(state) {
    this.state = state;
    SocketService.io.emit('mainFlow', mainFlow);
  }
}

const generateCreaActions = () => {
  const devices = Object.keys(words);
  return devices.map(device => {
    const deviceWords =  words[device];
    const actions = deviceWords.map(word => 
       new ActionService(() => SocketService.waitForEvent('crea-record-'+device), word[0]));
    return new FlowService(`ordinateur ${device}`, actions);
  });
}

const generateWasonTrainingActions = () => {
  const devices = ['main', 'crea1', 'crea2', 'crea3'];
  return devices.map(device => {
    const deviceButton =  [1, 2];
    const actions = deviceButton.map(word => new ActionService(() => SocketService.waitForEvent('wason-training-'+device), 'button'));
    return new FlowService(`ordinateur ${device}`, actions);
  });
}
const mainFlow = [
  new FlowService('Mise en situation', [
      new ActionService(() => SocketService.waitForEvent('begin'), 'Attente demarrage #button;begin;Demarrer#'),
      new ActionService(() => DeviceService.off(DeviceService.MAGNET_ENTRANCE), 'deblocage porte'),
      new ActionService(() => Helper.sleep(5), '5s fermeture porte'),
      new ActionService(() => DeviceService.on(DeviceService.MAGNET_LOCK), 'verouillage porte'),
      new ActionService(() => DeviceService.off(DeviceService.GLOBAL_LIGHT), 'extinction lumière globale'),
      new ActionService(() => SoundService.play(SoundService.siren), 'sirene'),
      new ActionService(() => (SocketService.io.emit('screen', 'berserk'), null), 'Ecrans berserk'),
      new ActionService(() => true, 'IA demarrage protocole sécurité'),
      new ActionService(() => DeviceService.on(DeviceService.SMALL_ELEC_LIGHT), 'allumage veilleuse elec')
    ]
  ),
  new FlowService('Enigme Elec', [
      new ActionService(() => Promise.race([SocketService.waitForEvent('elec-breaker-on'),SocketService.waitForEvent('force')]), 'En attente manipulation coffret electrique joueur #button;force;Forcer#'),
      new ActionService(() => (SocketService.io.emit('screen', 'elec_restored'), null), 'Ecrans backup generator restored'),
      new ActionService(() => DeviceService.on(DeviceService.GLOBAL_LIGHT), 'rallumage lumière globale'),
      new ActionService(() => true, 'IA crazy'),
    ]
  ),
  new FlowService('Enigme Crea', [
      new ActionService(() => (SocketService.io.emit('start-crea'), null), 'Demarrage des processus pour enigme Crea'),
      new ActionService(() => true, 'IA debut crea avec explications ou explications sur écran ?'),
      new ActionService(() => SocketService.waitForEvent('crea-connected'), 'Crea démarré'),
      new FlowService('Resultats', generateCreaActions(), ACTION_TYPE.PARALLEL),
      new ActionService(() => DeviceService.off(DeviceService.MAGNET_CLOSET_1), 'Ouverture placard 1'),
      new ActionService(() => true, 'Son placard débloqué'),
      new ActionService(() => true, 'IA crea terminé, analyse probleme'),
    ]
  ),
  new FlowService('Enigme Base de donnée et ordi central', [
      new ActionService(() => SocketService.waitForEvent('force'), 'Attente déclenchement par Game Master #button;force;Déclencher#'),
      new ActionService(() => Helper.openChromium('roger.html'), 'Allumage ecran Roger Moore sur identifiant de connection'),
      new ActionService(() => SocketService.waitForEvent('session-opened'), 'En attente dévérouillage session'),
    ]
  ),
  new FlowService('Enigme 4 clés', [
      new ActionService(() => Promise.race([Helper.sleep(600),SocketService.waitForEvent('force')]), 'Attente insertion 4 clés #button;force;Forcer#'),
      new ActionService(() => DeviceService.off(DeviceService.MAGNET_CLOSET_2), 'Ouverture placard 2'),
      new ActionService(() => true, 'Son placard débloqué'),
    ]
  ),
  new FlowService('Enigme Wason entrainement', [
      new ActionService(() => (SocketService.io.emit('start-wason-training'), null), 'Demarrage des processus pour enigme wason entrainement'),
      new ActionService(() => SocketService.waitForEvent('wason-training-started'), 'processus démarrés'),
      new FlowService('Resultats', generateWasonTrainingActions(), ACTION_TYPE.PARALLEL),
      new ActionService(() => true, 'IA wason entrainement terminé'),
      new ActionService(() => (SocketService.io.emit('close-wason-training'), null), 'Fermeture processus wason entrainement'),
    ]
  ),
  new FlowService('Enigme Wason', [
      new ActionService(() => (SocketService.io.emit('start-wason'), null), 'Demarrage processus wason'),
      new ActionService(() => SocketService.waitForEvent('wason-started'), 'processus démarrés'),
      new ActionService(() => true, 'IA wason mesure réelle'),
      new ActionService(() => SocketService.waitForEvent('force'), 'Attente insertion fusible 1'),
      new ActionService(() => SocketService.waitForEvent('force'), 'Attente insertion fusible 2'),
      new ActionService(() => true, 'IA quel reacteur éteindre ?'),
      new ActionService(() => true, 'Attente choix reacteur'),
      new ActionService(() => true, 'Déverouillage porte'),
      new ActionService(() => true, 'Rallumage lumière totale'),
      new ActionService(() => true, 'IA succés'),
  ])
];

module.exports = {
  ActionService,
  FlowService,
  mainFlow,
}

