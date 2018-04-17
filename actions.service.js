const Helper = require('./helper');
const SoundService = require('./sound.service');
const DeviceService = require('./device.service');


class ActionService {
  static async execute(action) {
    switch(action) {
      case 'reset':
        await ActionService.resetState();
      break;
      case 'begin':
        await ActionService.begin();
      break;
    }
  }

  
  static async begin(socket) {
    await DeviceService.on(DeviceService.MAGNET_LOCK);
    await Helper.delay(2);
    await DeviceService.off(DeviceService.MAGNET_LOCK);
    return;
    await DeviceService.off(DeviceService.MAGNET_ENTRANCE);
    await Helper.delay(3);
    SoundService.play(SoundService.siren);
    await DeviceService.on(DeviceService.MAGNET_LOCK);
    await DeviceService.off(DeviceService.GLOBAL_LIGHT);
    await DeviceService.on(DeviceService.GYRO);
    await DeviceService.on(DeviceService.SMALL_ELEC_LIGHT);
  }


}

module.exports = ActionService;
