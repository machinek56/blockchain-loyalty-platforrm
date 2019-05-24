<template>
    <div class="wallet-send">
        <h2>Перевести средства</h2>

        <b-form-group label="Выберите токен">
            <b-form-select v-model="selectedToken" :options="tokens"></b-form-select>
        </b-form-group>

        <b-form-group
                id="fieldset-1"
                label="Адрес получателя"
                label-for="input-1">
            <b-form-input id="input-1" v-model="addressTo" trim></b-form-input>
        </b-form-group>

        <b-form-group
                label="Сумма"
                label-for="input-1">
            <b-form-input v-model="amount" placeholder="0.0"></b-form-input>
        </b-form-group>

        <b-button @click="handleSendTransaction">Отправить</b-button>
        <b-spinner label="Spinning" class="ml-2" v-if="isLoading"></b-spinner>
    </div>
</template>

<script>
  import web3 from '../web3'
  import { mapActions } from 'vuex'

  export default {
    name: 'TransferFunds',

    props: {
      address: {
        type: String,
        required: true
      }
    },

    data: () => ({
      selectedToken: '',
      addressTo: '',
      amount: '',
      tokens: ['ETH'],
      isLoading: false
    }),

    methods: {
      ...mapActions(['sendTransaction']),

      async handleSendTransaction() {
        this.isLoading = true
        const transaction =  {
          to: this.addressTo,
          from: this.address,
          value: web3.utils.toWei(this.amount, 'ether')
        }

        await this.sendTransaction(transaction)

        this.isLoading = false
      }
    }
  }
</script>

<style scoped>

</style>