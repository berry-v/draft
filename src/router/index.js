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
    component: () => import('@/views/modules/AntVG6/AntVG6.vue')
  }, {
    path: '/gojs',
    name: 'gojs',
    component: () => import('@/views/modules/gojs/gojs.vue')
  }, {
    path: '/gojsdemo',
    name: 'gojsdemo',
    component: () => import('@/views/modules/gojsDemo/gojs.vue')
  }]
})
