<template>
    <b-card title="Аккаунт"
            tag="article"
            style="max-width: 20rem;"
            class="mb-2 mr-lg-5">

        <b-card-text>
            <div class="mb-2">
                <strong>Адрес кошелька:</strong> {{address}}
            </div>

            <div class="mb-2">
                <strong>Баланс:</strong>
                {{balance}}
            </div>

            <div class="mb-2">
                <strong>Токен: {{tokenSymbol}}</strong>
            </div>

            <div v-if="!isPartner" class="mb-2">
                <strong>{{user.name}}</strong>
                <p>{{user.phone}}</p>
                <p><b>Баллы:</b> {{user.points}}</p>
            </div>

        </b-card-text>
    </b-card>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import web3 from '../web3'
  import { TOKEN } from '@/config'

  export default {
    name: 'AccountInfo',
    props: {
      isPartner: {
        type: Boolean
      }
    },
    data: () => ({
      balance: '',
      tokenSymbol: 'ETH',
    }),

    computed: {
      ...mapState(['user', 'address'])
    },

    methods: {
      ...mapActions(['getClientInfo']),

      async getBalance() {
        let balance = await web3.eth.getBalance(this.address)
        this.balance = await web3.utils.fromWei(balance)
      },

      async getToken() {
        let contract = new web3.eth.Contract(TOKEN.ABI, TOKEN.ADDRESS)
        const res = await contract.methods.mint(this.address, 10000).call()
        console.log(res)
        this.tokenSymbol = await contract.methods.symbol().call()
      }
    },

    mounted () {
      this.getBalance()
      this.getToken()
      if (!this.isPartner) {
        this.getClientInfo()
      }
    }
  }
</script>

<style scoped>

</style>