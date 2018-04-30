const Helper = require('./helper');
const SoundService = require('./sound.service');
const DeviceService = require('./device.service');

const ACTION_STATE = {
  PENDING: 'pending',
  STARTED: 'started',
  FINISHED: 'finished'
}

class ActionService {
  constructor(action, description) {
    this.action = action;
    this.description = description;
    this.state = ACTION_STATE.PENDING;
  }

  async execute() {
    this.changeState(ACTION_STATE.STARTED);
    await this.state();
    this.changeState(ACTION_STATE.FINISHED);
  }

  changeState(state) {
    this.state = state;
    io.emit('actions', mainFlow);
  }
}

const mainFlow = [
  {
    title: 'demarrage',
    actions: [
      new ActionService(() => DeviceService.off(DeviceService.MAGNET_ENTRANCE), 'deblocage porte'),
      new ActionService(() => Helper.sleep(3), '3s fermeture porte'),
      new ActionService(() => SoundService.play(SoundService.siren), 'sirene'),
      new ActionService(() => DeviceService.on(DeviceService.MAGNET_LOCK), 'verouillage porte'),
      new ActionService(() => DeviceService.off(DeviceService.GLOBAL_LIGHT), 'extinction lumière globale'),
      new ActionService(() => DeviceService.on(DeviceService.GYRO), 'allumage gyrophare'),
      new ActionService(() => DeviceService.on(DeviceService.SMALL_ELEC_LIGHT), 'allumage veilleuse elec')
    ]
  },
  {
    title: 'elec',
    actions: [
    ]
  }
];

module.exports = {
  ActionService,
  mainFlow,
}
