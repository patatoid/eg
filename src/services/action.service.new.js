const StateMachine = require('javascript-state-machine')
const SoundService = require('./sound.service')
const DeviceService = require('./device.service')
const { io } = require('../server')
const Helper = require('../helper')

class ActionService {
  constructor () {
    this.stateMachine = new StateMachine({
      init: 'initial',
      transitions: [
        { name: 'boot', from: 'initial', to: 'ready' },
        { name: 'restart', from: '*', to: 'ready' },
        { name: 'start', from: 'ready', to: 'started' },
        { name: 'darkness', from: 'started', to: 'dark' },
        { name: 'lightOn', from: 'dark', to: 'light' },
        { name: 'trainCreativity', from: 'light', to: 'creativityTraining' },
        { name: 'startCreativityTask', from: 'creativityTraining', to: 'creativityTask' },
        { name: 'endCreativityTask', from: 'creativityTask', to: 'waitRedNucleaAppearance' },
        { name: 'redNucleaAppear', from: 'waitRedNucleaAppearance', to: 'firstGlitch' },
        { name: 'openMooreSession', from: 'firstGlitch', to: 'mooreSession' }
      ],
      methods: {
        onRestart: async () => {
          await DeviceService.off(DeviceService.MAGNET_CLOSET_1)
          await DeviceService.off(DeviceService.MAGNET_CLOSET_2)
          await DeviceService.on(DeviceService.MAGNET_ENTRANCE)
          await DeviceService.off(DeviceService.MAGNET_LOCK)
          await DeviceService.off(DeviceService.GYRO)
          await DeviceService.on(DeviceService.GLOBAL_LIGHT)

          io.in('all').emit('open-ready')
        },
        onBoot: async () => {
          Helper.openChromium('new/index.html', { cursor: true })
        },
        onStart: async () => {
          await DeviceService.off(DeviceService.MAGNET_ENTRANCE)
          await DeviceService.on(DeviceService.MAGNET_LOCK)

          io.in('all').emit('open-dashboard')
          io.in('all').emit('start')
        },
        onDarkness: async () => {
          io.in('all').emit('open-dark')

          await DeviceService.off(DeviceService.GLOBAL_LIGHT)
          await DeviceService.on(DeviceService.GYRO)
          await SoundService.playAndWait(SoundService.siren, 10)
        },
        onLightOn: async () => {
          io.in('all').emit('open-dark')

          await DeviceService.off(DeviceService.GYRO)
          await DeviceService.on(DeviceService.GLOBAL_LIGHT)
        },
        onTrainCreativity: async () => {
          io.in('satelite').emit('open-dark')
          io.in('main').emit('open-creativity-training')
        },
        onStartCreativityTask: async () => {
          io.in('all').emit('open-creativity-task')
          io.emit('start-creativity-task')
        },
        onEndCreativityTask: async () => { },
        onRedNucleaAppear: async () => {
          io.in('all').emit('open-first-glitch')
        },
        onOpenMooreSession: async () => {
          io.in('main').emit('open-second-glitch')
          io.in('satelite').emit('open-dark')
        }
      }
    })
  }

  can (action) {
    return this.stateMachine.can(action)
  }

  async trigger (action) {
    try {
      return await this.stateMachine[action]()
    } catch (error) {
      console.log(this.stateMachine)
      console.log(error)
    }
  }
}

module.exports = new ActionService()
