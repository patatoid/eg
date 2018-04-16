const Helper = require('./helper');

const ON=1;
const OFF=0;
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

  static async resetState() {
   for(let device in defaultState) {
    await ActionService.change(device, defaultState[device]);
   }
  }
  
  static async beginning(socket) {
    await ActionService.change(MAGNET_ENTRANCE, OFF);
    await Helper.delay(3);
    await ActionService.change(MAGNET_LOCK, ON);
    await ActionService.change(GLOBAL_LIGHT, OFF);
    await Helper.delay(2);
    await ActionService.change(GYRO, ON);
    await ActionService.change(SMALL_ELEC_LIGHT, ON);
  }

  static async change(device, state) {
    
  }

}

module.exports = ActionService;
