const Helper = require('./helper');

const ON='on';
const OFF='off';
const MAGNET_ENTRANCE=0;
const MAGNET_LOCK=1;
const GLOBAL_LIGHT=2;
const SMALL_ELEC_LIGHT=3;
const GYRO=4;
const MAGNET_CREA_KEY=5;
const defaultState = {
  MAGNET_ENTRANCE: ON,
  MAGNET_LOCK: OFF,
  GLOBAL_LIGHT: ON,
  SMALL_ELEC_LIGHT: OFF,
  GYRO: OFF,
  MAGNET_CREA_KEY: OFF,
};

class DeviceService {
  static get MAGNET_ENTRANCE() { return MAGNET_ENTRANCE; }
  static get MAGNET_LOCK() { return MAGNET_LOCK; }
  static get GLOBAL_LIGHT() { return GLOBAL_LIGHT; }
  static get SMALL_ELEC_LIGHT() { return SMALL_ELEC_LIGHT; }
  static get GYRO() { return GYRO; }
  static get MAGNET_CREA_KEY() { return MAGNET_CREA_KEY; }

  static async resetState() {
   for(let device in defaultState) {
    await DeviceService.change(device, defaultState[device]);
   }
  }

  static async on(device) {
    await DeviceService.change(device, ON);
  }

  static async off(device) {
    await DeviceService.change(device, OFF);
  }

  static async change(device, state) {
    return new Promise((resolve, reject) => {
      console.log('process chacon start', device, state);
      const process = Helper.launchProcess(['sudo', ['scripts/chacon_send/chacon_send', '0', '18922461', device, state]]);
      process.on('close', (code) => {
        if(code === 0) resolve();
        else reject();
      })
    });
  }
}

module.exports = DeviceService;
