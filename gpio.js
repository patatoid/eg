//const gpio = require('rpi-gpio');
const EventEmitter = require('events');
class gpio {
   static get DIR_IN() {}
   static get EDGE_BOTH() {}
   static setup() { }
   static on() { }
}
const gpioListener = new EventEmitter();
gpioListener.setMaxListeners(50);

gpio.on('change', (pin, value) => {
  console.log('pin ' + value + ' value is now ' + value);
  gpioListener.emit(`${pin}_${value}`);
})

class GpioService {
  static get DIR_IN() {
    return gpio.DIR_IN;
  }

  static get EDGE_BOTH() {
    return gpio.EDGE_BOTH;
  }

  static get EDGE_RISING() {
    return gpio.EDGE_RISING;
  }

  static declareGpioPin(pin, dir, changedStrategy) {
    gpio.setup(pin, dir, changedStrategy);
  }

  static listenOnChange(listener) {
    gpio.on('change', listener);
  }

  static async buttonChanged(pin, state) {
    return new Promise((resolve, reject) => {
      gpioListener.once(`${pin}_${state}`, () => {
        resolve({channel: pin, value: state});
      });
    });
  }
  static async buttonWasonChanged(pins, state) {
    return Promise.race(pins.map(pin => GpioService.buttonChanged(pin, state)));
  }
}
module.exports = {
  gpio,
  GpioService,
  gpioListener,
}
