const Helper = require('./helper');

const ON='on';
const OFF='off';
const MAGNET_ENTRANCE=3;
const MAGNET_LOCK=1;
const GLOBAL_LIGHT=2;
const GYRO=4;
const MAGNET_CLOSET_1=5;
const MAGNET_CLOSET_2=6;

class DeviceService {
  static get MAGNET_ENTRANCE() { return MAGNET_ENTRANCE; }
  static get MAGNET_LOCK() { return MAGNET_LOCK; }
  static get GLOBAL_LIGHT() { return GLOBAL_LIGHT; }
  static get SMALL_ELEC_LIGHT() { return SMALL_ELEC_LIGHT; }
  static get GYRO() { return GYRO; }
  static get MAGNET_CLOSET_1() { return MAGNET_CLOSET_1; }
  static get MAGNET_CLOSET_2() { return MAGNET_CLOSET_2; }

  static async on(device) {
    await DeviceService.change(device, ON);
    await DeviceService.change(device, ON);
  }

  static async off(device) {
    await DeviceService.change(device, OFF);
    await DeviceService.change(device, OFF);
  }

  static async change(device, state) {
    await Helper.sleep(0.2);
    return new Promise((resolve, reject) => {
      console.log('process chacon start', device, state);
      const process = Helper.launchProcess(['sudo', ['scripts/chacon_send/chacon_send', '0', '18922461', device, state]]);
      process.on('close', (code) => {
        if(code !== 0) console.log('chacon_send process error code '+code);
        setTimeout(() => resolve(), 200);
      })
    });
  }
}

module.exports = DeviceService;
