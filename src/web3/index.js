import Web3 from "web3"
import store from '../store'
import { TOKEN } from '../config.js'

const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")

web3.givenProvider.publicConfigStore.on('update', callback)

function callback (data) {
  store.commit('setAddress', data.selectedAddress)
}

const tokenAddress = TOKEN.ADDRESS
const tokenSymbol = 'CTK'
const tokenDecimals = 18

ethereum.sendAsync({
  method: 'wallet_watchAsset',
  params: {
    "type":"ERC20",
    "options":{
      "address": tokenAddress,
      "symbol": tokenSymbol,
      "decimals": tokenDecimals,
      "image": ''
    },
  },
  id: Math.round(Math.random() * 100000),
}, (err, added) => {

  if (added) {
    console.log('Thanks for your interest!')
  } else {
    console.log('Your loss!')
  }
})

export default web3