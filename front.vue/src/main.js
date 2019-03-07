import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import socket from './socket'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

socket.on('open-dashboard', () => {
  router.push({ name: 'dashboard' })
})
socket.on('open-dark', () => {
  router.push({ name: 'dark' })
})
socket.on('open-creativity-training', () => {
  router.push({ name: 'creativity-training' })
})
socket.on('open-creativity-task', () => {
  router.push({ name: 'creativity-task' })
})
socket.on('open-ready', () => {
  router.push({ name: 'ready' })
})
socket.on('open-glitch', () => {
  router.push({ name: 'glitch' })
})
socket.emit('identification', '${DEVICE_NAME}')
