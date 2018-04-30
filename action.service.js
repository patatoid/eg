const Helper = require('./helper');
const SoundService = require('./sound.service');
const DeviceService = require('./device.service');
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
      new ActionService(() => SocketService.waitForEvent('begin'), 'Attente demarrage #button;begin#'),
      new ActionService(() => DeviceService.off(DeviceService.MAGNET_ENTRANCE), 'deblocage porte'),
      new ActionService(() => Helper.sleep(5), '5s fermeture porte'),
      new ActionService(() => SoundService.play(SoundService.siren), 'sirene'),
      new ActionService(() => DeviceService.on(DeviceService.MAGNET_LOCK), 'verouillage porte'),
      new ActionService(() => DeviceService.off(DeviceService.GLOBAL_LIGHT), 'extinction lumière globale'),
      new ActionService(() => DeviceService.on(DeviceService.GYRO), 'allumage gyrophare'),
      new ActionService(() => DeviceService.on(DeviceService.SMALL_ELEC_LIGHT), 'allumage veilleuse elec')
    ]
  ),
  new FlowService('Enigme elec', [
      new ActionService(() => Helper.sleep(100), 'En attente manipulation coffret electrique joueur'),
    ]
  ),
];

module.exports = {
  ActionService,
  FlowService,
  mainFlow,
}

