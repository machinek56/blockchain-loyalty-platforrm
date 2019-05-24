<template>
    <div class="container">
        <div class="mt-4 d-flex">
            <b-card
                title="Аккаунт"
                tag="article"
                style="max-width: 20rem;"
                class="mb-2 mr-lg-5"
            >
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

                <b-button v-if="!isPartner"
                        @click="showTransactions = !showTransactions"
                        href="#">Показать транзакции</b-button>
            </b-card>

            <b-tabs content-class="mt-3" >
                <b-tab title="Перевести средства" active>
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

                </b-tab>

                <b-tab title="Заработать токены" v-if="!isPartner">
                    <div class="wallet-send">
                        <h4>Заработать токены через покупки</h4>

                        <b-form-group label="Выберите партнера">
                            <b-form-select v-model="selectedPartner" :options="partners"></b-form-select>
                        </b-form-group>

                        <h5>Выберите товар</h5>
                        <div class="mb-2">
                            <b-button variant="outline-secondary"
                                      @click="buyProduct('10')">Купить товар №1 и получить 10 баллов</b-button>
                        </div>

                        <div class="mb-2">
                            <b-button variant="outline-secondary"
                                      @click="buyProduct('50')">Купить товар №2 и получить 50 баллов</b-button>
                        </div>

                        <div class="mb-2">
                            <b-button variant="outline-secondary"
                                      @click="buyProduct('100')">Купить товар №3 и получить 100 баллов</b-button>
                        </div>
                    </div>
                </b-tab>

                <b-tab title="Потратить токены" v-if="!isPartner">
                    <div class="wallet-send">
                        <h4>Потратить токены через покупки</h4>

                        <b-form-group label="Выберите партнера">
                            <b-form-select v-model="selectedPartner" :options="partners"></b-form-select>
                        </b-form-group>

                        <h5>Выберите товар</h5>
                        <div class="mb-2">
                            <b-button variant="outline-secondary"
                                      @click="buyProductForToken('10')">Купить товар №1 за 10 баллов</b-button>
                        </div>

                        <div class="mb-2">
                            <b-button variant="outline-secondary"
                                      @click="buyProductForToken('50')">Купить товар №2 за 50 баллов</b-button>
                        </div>

                        <div class="mb-2">
                            <b-button variant="outline-secondary"
                                      @click="buyProductForToken('100')">Купить товар №3 за 100 баллов</b-button>
                        </div>
                    </div>
                </b-tab>

                <b-tab title="Посмотреть транзакции" v-if="isPartner">
                    <div style="max-width: 800px;">
                        <h2>Транзакции</h2>

                        <b-table striped hover small responsive :items="transactions"></b-table>
                    </div>

                </b-tab>

            </b-tabs>

        </div>

        <b-table v-show="showTransactions"
                striped hover small responsive :items="transactions"></b-table>

    </div>
</template>

<script>
  import web3 from '../web3'
  import { mapState, mapActions, mapGetters } from 'vuex'
  import { TOKEN } from '@/config'

  export default {
    name: 'Account',

    data: () => ({
      address: '',
      balance: '',
      selectedToken: '',
      tokens: ['ETH'],
      addressTo: '',
      amount: '',
      isLoading: false,
      showTransactions: false,
      token: {
        name: '',
        symbol: '',
        decimals: ''
      },
      tokenName: '',
      tokenSymbol: 'ETH',
      transactions: [],
      contract: {},
      partners: [],
      selectedPartner: null
    }),

    computed: {
      ...mapState(['user']),
      ...mapGetters(['userType']),

      isPartner () {
        return this.userType === 'PARTNER'
      }
    },

    methods: {
      ...mapActions(['sendTransaction', 'getClientInfo', 'getPartnerList', 'earnPoints', 'usePoints']),

      async getBalance() {
       let balance = await web3.eth.getBalance(this.address);
       this.balance = await web3.utils.fromWei(balance)
      },

      async getToken() {
        // let contract = new web3.eth.Contract(TOKEN.ABI, TOKEN.ADDRESS)
        // const res = await contract.methods.mint('0x333dcd15AbD50180C56a618Ac240250bB4a2eDA8', 10000).call()
        // console.log(res)
        // this.tokenName = await contract.methods.name().call()
        // this.tokenSymbol = await contract.methods.name().call()
      },

      async handleSendTransaction() {
        this.isLoading = true
        const transaction =  {
          to: this.addressTo,
          from: this.address,
          value: web3.utils.toWei(this.amount, 'ether')
        }

        await this.sendTransaction(transaction)

        this.isLoading = false
        this.getBalance()
      },

      async getPartners() {
        this.partners = await this.getPartnerList()
      },

      getTransactions() {
        web3.eth.getTransactionCount(this.address, 'latest', (err, current) => {
          for (let i = 1; i <= current; i++) {
            web3.eth.getBlock(i, (err, res) => {
              web3.eth.getTransactionReceipt(res.transactions[0])
                .then(res => {
                  const item =  {
                    hash: res.transactionHash,
                    status: res.status,
                    from: res.from,
                    to: res.to,
                    gasUsed: res.gasUsed
                  }
                  this.transactions.push(item)
                })
            })
          }
        });
      },

      async buyProduct(points) {
        const data = {
          points,
          partnerAddress: this.selectedPartner
        }
        await this.earnPoints(data)
      },

      async buyProductForToken(points) {
        const data = {
          points,
          partnerAddress: this.selectedPartner
        }
        await this.usePoints(data)
      }
    },

    mounted () {
      this.address = sessionStorage.getItem('account')
      this.getBalance()
      this.getToken()
      this.getTransactions()
      this.getPartners()
      if (!this.isPartner) {
        this.getClientInfo()
      }
    }
  }
</script>

<style scoped>
    .wallet-send {
        max-width: 400px;
        width: 100%;
    }
</style>