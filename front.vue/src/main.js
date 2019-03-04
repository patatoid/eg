import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
const socket = io('http://192.168.0.2:3000')

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
socket.on('open-ready', () => {
  router.push({ name: 'ready' })
})
socket.emit('identification', '${DEVICE_NAME}')
