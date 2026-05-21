import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/router/home/index'
import openPage from '@/router/open'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '*',
      component: () => import('@/views/home/error/notFound.vue')
    },
    {
      path: '/',
      name: 'Home',
      meta: {
        requiresAuth: false
      },
      component: () => import(
        /* webpackChunkName: "home" */
        '@/views/home/index.vue'
      ),
      children: Home
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        requiresAuth: false
      },
      component: () => import('@/views/login')
    },
    {
      path: '/sso',
      name: 'sso',
      meta: {
        requiresAuth: false
      },
      component: () => import('@/views/login/sso.vue')
    },
    {
      path: '/transfer',
      name: 'transfer',
      meta: {
        requiresAuth: false
      },
      component: () => import('@/views/login/transfer.vue')
    },
    ...openPage
  ]
})
