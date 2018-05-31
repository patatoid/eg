const _ = require('lodash');
const { gpio } = require('./gpio');
const { spawn } = require('child_process');

module.exports=class Helper {
  static async sleep(seconds) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(seconds*1000), seconds*1000);
    });
  }

  static async wait() {
    return new Promise((resolve, reject) => null);
  }

  static launchProcess(process) {
    return spawn(...process);
  }

  static openChromium(url) {
    Helper.launchProcess(['sh', ['./scripts/start-chromium.sh', `http://localhost:3000/${url}`], {env: process.env}])
  }

  static closeChromium() {
    Helper.launchProcess(['killall', ['chromium-browser']]);
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
  static async buttonWasonChanged(pins, state) {
    return new Promise((resolve, reject) => {
      const listener = (channel, value) => {
        console.log('wason -> Channel ' + channel + ' value is now ' + value);
        console.log('pins', pins);
        if(_.includes(pins, channel)) {
          gpio.removeListener('change', listener);
          if(value === state) resolve({channel, value});
        }
      };
      gpio.on('change', listener);
    });
  }
}

