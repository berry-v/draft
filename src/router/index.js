import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'main',
    component: () => import('@/views/main.vue')
  }, {
    path: '/AntVG6',
    name: 'AntVG6',
    component: () => import('@/views/modules/AntVG6.vue')
  }]
})
