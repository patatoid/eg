const _ = require('lodash')
const { spawn } = require('child_process')

module.exports = class Helper {
  static async sleep (seconds) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(seconds * 1000), seconds * 1000)
    })
  }

  static async wait () {
    return new Promise((resolve, reject) => null)
  }

  static async predicate (condition) {
    if (condition) return
    await Helper.wait()
  }

  static launchProcess (process) {
    return spawn(...process)
  }

  static openChromium (url, { cursor = false } = {}) {
    Helper.launchProcess(['sh', ['./scripts/start-chromium.sh', `http://localhost:3000/${url}`, ...(cursor ? [] : ['-nocursor'])], { env: process.env }])
  }

  static closeChromium () {
    Helper.launchProcess(['killall', ['chromium-browser']])
  }
}
