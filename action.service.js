const Helper = require('./helper');
const SoundService = require('./sound.service');
const DeviceService = require('./device.service');
const MainServerService = require('./main.server.service');
const { SocketService } = require('./socket.service');

const ACTION_STATE = {
  PENDING: 'pending',
  STARTED: 'started',
  FINISHED: 'finished'
}


class FlowService {
 constructor(title, actions) {
  this.title = title;
  this.actions = actions;
 }

 static async executePromises(actions) {
  for (let action of actions) {
    await action.execute();
  }
 }
 async execute() {
   await FlowService.executePromises(this.actions);
 }
}

class ActionService {
  constructor(action, description) {
    this.action = action;
    this.description = description;
    this.state = ACTION_STATE.PENDING;
  }

  async execute() {
    this.changeState(ACTION_STATE.STARTED);
    await this.action();
    this.changeState(ACTION_STATE.FINISHED);
  }

  changeState(state) {
    this.state = state;
    SocketService.io.emit('mainFlow', mainFlow);
  }
}

const mainFlow = [
  new FlowService('Mise en situation', [
      new ActionService(() => SocketService.waitForEvent('begin'), 'Attente demarrage #button;begin;Demarrer#'),
      new ActionService(() => DeviceService.off(DeviceService.MAGNET_ENTRANCE), 'deblocage porte'),
      new ActionService(() => Helper.sleep(5), '5s fermeture porte'),
      new ActionService(() => DeviceService.on(DeviceService.MAGNET_LOCK), 'verouillage porte'),
      new ActionService(() => SoundService.play(SoundService.siren), 'sirene'),
      new ActionService(() => MainServerService.emit('screen', 'berserk'), 'Ecrans berserk'),
      new ActionService(() => DeviceService.off(DeviceService.GLOBAL_LIGHT), 'extinction lumière globale'),
      new ActionService(() => DeviceService.on(DeviceService.GYRO), 'allumage gyrophare'),
      new ActionService(() => DeviceService.on(DeviceService.SMALL_ELEC_LIGHT), 'allumage veilleuse elec')
    ]
  ),
  new FlowService('Enigme Elec', [
      new ActionService(() => Promise.race([Helper.sleep(100),SocketService.waitForEvent('force')]), 'En attente manipulation coffret electrique joueur #button;force;Forcer#'),
      new ActionService(() => DeviceService.on(DeviceService.GLOBAL_LIGHT), 'rallumage lumière globale'),
      new ActionService(() => DeviceService.off(DeviceService.GYRO), 'extinction gyrophare'),
    ]
  ),
  new FlowService('Enigme Crea', [
      new ActionService(() => Promise.race([Helper.sleep(600),SocketService.waitForEvent('force')]), 'Pause 10mn #button;force;Forcer#'),
      new ActionService(() => true, 'Allumage des écrans pour crea'),
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

