import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
import web3 from '../web3'

import { LOYALTY_PROGRAM } from '@/config'

const store = new Vuex.Store({
  // plugins: [createPersistedState()],

  state: {
    user: {},
    userType: {}
  },

  mutations: {
    setUser: (state, payload) => state.user = payload,
    setUserType: (state, payload) => state.userType = payload
  },

  getters: {
    userType: state => state.userType
  },

  actions: {
    sendTransaction(context, data) {
      web3.eth.sendTransaction(data)
    },

    async registerUser(context, { fullName, phone }) {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      const res = await contract.methods.registerMember(
        fullName,
        phone
      ).send({ from: sessionStorage.getItem('account')})
      console.log(res)
      return res
    },

    async registerPartner(context, data) {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      const res = await contract.methods.registerPartner(data).send({ from: sessionStorage.getItem('account')})
      console.log(res)
      return res
    },

    async getPartnerList() {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      let partnersLength = await contract.methods.partnersInfoLength().call()
      partnersLength = partnersLength.toNumber()

      let partnersData = [];
      for (let i = 0; i < partnersLength; i++) {
        partnersData.push(await contract.methods.getPartnerAt(i).call())
      }
      return partnersData
    },

    async getClientInfo({ commit }) {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      const user = await contract.methods.getMemberAt().call()
      commit('setUser', user)
    },

    async earnPoints(context, data) {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      const res = await contract.methods.earnPoints(data.points, data.partnerAddress)
        .send({from: sessionStorage.getItem('account')})
      return res
    },

    async usePoints(context, data) {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      const res = await contract.methods.usePoints(data.points, data.partnerAddress)
        .send({from: sessionStorage.getItem('account')})
      return res
    }
  }
})

export default store

