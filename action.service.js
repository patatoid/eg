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

const mainFlow = [
  new FlowService('Mise en situation', [
      new ActionService(() => SocketService.waitForEvent('begin'), 'Attente demarrage #button;begin;Demarrer#'),
      new ActionService(() => DeviceService.off(DeviceService.MAGNET_ENTRANCE), 'deblocage porte'),
      new ActionService(() => Helper.sleep(5), '5s fermeture porte'),
      new ActionService(() => DeviceService.on(DeviceService.MAGNET_LOCK), 'verouillage porte'),
      new ActionService(() => DeviceService.off(DeviceService.GLOBAL_LIGHT), 'extinction lumière globale'),
      new ActionService(() => SoundService.play(SoundService.siren), 'sirene'),
      new ActionService(() => (SocketService.io.emit('screen', 'berserk'), null), 'Ecrans berserk'),
      new ActionService(() => DeviceService.on(DeviceService.GYRO), 'allumage gyrophare'),
      new ActionService(() => DeviceService.on(DeviceService.SMALL_ELEC_LIGHT), 'allumage veilleuse elec')
    ]
  ),
  new FlowService('Enigme Elec', [
      new ActionService(() => Promise.race([SocketService.waitForEvent('elec-breaker-on'),SocketService.waitForEvent('force')]), 'En attente manipulation coffret electrique joueur #button;force;Forcer#'),
      new ActionService(() => (SocketService.io.emit('screen', 'elec_restored'), null), 'Ecrans backup generator restored'),
      new ActionService(() => DeviceService.on(DeviceService.GLOBAL_LIGHT), 'rallumage lumière globale'),
      new ActionService(() => DeviceService.off(DeviceService.GYRO), 'extinction gyrophare'),
    ]
  ),
  new FlowService('Enigme Crea', [
      new ActionService(() => Promise.race([Helper.sleep(600),SocketService.waitForEvent('force')]), 'Pause 10mn #button;force;Forcer#'),
      new ActionService(() => (SocketService.io.emit('start-crea'), null), 'Demarrage des processus pour enigme Crea'),
      new ActionService(() => SocketService.waitForEvent('crea-connected'), 'Crea démarré'),
      new FlowService('Resultats', generateCreaActions(), ACTION_TYPE.PARALLEL),
    ]
  ),
  new FlowService('Enigme Base de donnée', [
      new ActionService(() => Promise.race([Helper.sleep(600),SocketService.waitForEvent('force')]), 'Pause 10mn #button;force;Forcer#'),
      new ActionService(() => true, 'Allumage ecran Roger Moore sur identifiant de connection'),
      new ActionService(() => true, 'En attente dévérouillage session'),
      new ActionService(() => true, 'En attente lecture video'),
    ]
  ),
  new FlowService('Enigme 4 clés', [
      new ActionService(() => Promise.race([Helper.sleep(600),SocketService.waitForEvent('force')]), 'Attente insertion 4 clés #button;force;Forcer#'),
    ]
  ),
  new FlowService('Enigme Watson', [
      new ActionService(() => Promise.race([Helper.sleep(600),SocketService.waitForEvent('force')]), 'Attente insertion fusible 1 #button;force;Forcer#'),
      new ActionService(() => Promise.race([Helper.sleep(600),SocketService.waitForEvent('force')]), 'Attente insertion fusible 2 #button;force;Forcer#'),
    ]
  ),
];

module.exports = {
  ActionService,
  FlowService,
  mainFlow,
}

