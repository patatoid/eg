import Vue from 'vue'
import Router from 'vue-router'
import Ready from './views/Ready.vue'
import Dashboard from './views/Dashboard.vue'
import CreativityTraining from './views/CreativityTraining.vue'
import CreativityTask from './views/CreativityTask.vue'
import CreativityTaskEnd from './views/CreativityTaskEnd.vue'
import Dark from './views/Dark.vue'
import FirstGlitch from './views/FirstGlitch.vue'
import SecondGlitch from './views/SecondGlitch.vue'
import MooreSession from './views/MooreSession.vue'
import MooreDesktop from './views/MooreDesktop.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ready',
      component: Ready
    }, {
      path: '/ready',
      name: 'ready',
      component: Ready
    }, {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    }, {
      path: '/dark',
      name: 'dark',
      component: Dark
    }, {
      path: '/creativity-training',
      name: 'creativity-training',
      component: CreativityTraining
    }, {
      path: '/creativity-task',
      name: 'creativity-task',
      component: CreativityTask
    }, {
      path: '/creativity-task-end',
      name: 'creativity-task-end',
      component: CreativityTaskEnd
    }, {
      path: '/first-glitch',
      name: 'first-glitch',
      component: FirstGlitch
    }, {
      path: '/second-glitch',
      name: 'second-glitch',
      component: SecondGlitch
    }, {
      path: '/moore-session',
      name: 'moore-session',
      component: MooreSession
    }, {
      path: '/moore-desktop',
      name: 'moore-desktop',
      component: MooreDesktop
    }
  ]
})
