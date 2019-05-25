import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Account from '@/components/Account'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/account',
      component: Account
    }
  ]
})

export default router