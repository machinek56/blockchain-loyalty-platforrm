import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
import web3 from '../web3'

import { LOYALTY_PROGRAM } from '@/config'

const store = new Vuex.Store({
  plugins: [createPersistedState()],

  state: {
    user: {},
    userType: {},
    address: ''
  },

  mutations: {
    setUser: (state, payload) => {
      state.user= {
        name: payload[0],
        phone: payload[1],
        points: payload[2].toNumber()
      }
    },

    setUserType: (state, payload) => state.userType = payload,

    setAddress: (state, payload) => state.address = payload
  },

  getters: {
    userType: state => state.userType
  },

  actions: {
    async sendTransaction(context, data) {
      return await web3.eth.sendTransaction(data)
    },

    async registerUser({ state }, { fullName, phone }) {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      const res = await contract.methods.registerMember(
        fullName,
        phone
      ).send({ from: state.address })
      console.log(res)
      return res
    },

    async registerPartner({ state }, data) {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      const res = await contract.methods.registerPartner(data).send({ from: state.address })
      console.log(res)
      return res
    },

    async getPartnerList() {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      let partnersLength = await contract.methods.partnersInfoLength().call()
      partnersLength = partnersLength.toNumber()

      let partnersData = []
      for (let i = 0; i < partnersLength; i++) {
        partnersData.push(await contract.methods.getPartnerAt(i).call())
      }
      return partnersData
    },

    async getClientInfo({ commit, state }) {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      const user = await contract.methods.getMemberAt().call({
        from: state.address
      })
      commit('setUser', user)
    },

    async earnPoints({ state }, data) {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      const res = await contract.methods.earnPoints(data.points, data.partnerAddress)
        .send({from: state.address })
      return res
    },

    async usePoints({ state }, data) {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      const res = await contract.methods.usePoints(data.points, data.partnerAddress)
        .send({from: state.address })
      return res
    },

    async getTransactionsInfo() {
      const contract = new web3.eth.Contract(LOYALTY_PROGRAM.ABI, LOYALTY_PROGRAM.ADDRESS)
      let count = await contract.methods.transactionsInfoLength().call()
      count = count.toNumber()

      let transactionsData = []
      for (let i = 0; i < count; i++) {
        transactionsData.push(await contract.methods.getTransactionAt(i).call())
      }
      return transactionsData
    }
  }
})

export default store

