const gpio = require('rpi-gpio');
const { spawn } = require('child_process');

module.exports=class Helper {
  static async sleep(seconds) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(seconds*1000), seconds*1000);
    });
  }

  static launchProcess(process) {
    return spawn(...process);
  }

  static declareGpioPin(pin, dir, changedStrategy) {
    gpio.setup(pin, dir, changedStrategy);
  }

  static listenOnChange(listener) {
    gpio.on('change', listener);
  }

  static async buttonChanged(pin, state) {
    return new Promise((resolve, reject) => {
      const listener = (channel, value) => {
        console.log('Channel ' + channel + ' value is now ' + value);
        if(channel === pin && state === value) {
          gpio.removeListener('change', listener);
          resolve(value);
        }
      };
      gpio.on('change', listener);
    });
  }
}

