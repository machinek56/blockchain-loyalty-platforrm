import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Wallet from '@/components/Wallet'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/wallet',
      component: Wallet
    },
    {
      path: '*',
      component: Login
    }
  ]
})

export default router