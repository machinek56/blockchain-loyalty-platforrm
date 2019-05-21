import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import web3 from '../web3'

import { USER } from '@/config'

const store = new Vuex.Store({
  state: {
    user: {}
  },

  mutations: {
    setUser: (state, payload) => state.user = payload
  },

  actions: {
    sendTransaction(context, data) {
      web3.eth.sendTransaction(data)
    },

    async registerUser(context, data) {
      const contract = new web3.eth.Contract(USER.ABI, USER.ADDRESS)
      const res = await contract.methods.registerUser(
        data.address,
        data.userType,
        data.fullName,
        data.phone
      ).call()
      return res
    },

    async getUser({ commit }, address) {
      const contract = new web3.eth.Contract(USER.ABI, USER.ADDRESS)
      const res = await contract.methods.getUser(address).call()
      // const res = contract.methods.getUser(address).call((err, result) => { console.log(result) })
      commit('setUser', res)
    }
  }
})

export default store

