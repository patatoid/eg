import Vue from 'vue'
import Router from 'vue-router'
import Ready from './views/Ready.vue'
import Dashboard from './views/Dashboard.vue'
import CreativityTraining from './views/CreativityTraining.vue'
import Dark from './views/Dark.vue'

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
    }
  ]
})
