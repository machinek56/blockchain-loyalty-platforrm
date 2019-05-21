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
                        <strong>Токен:</strong>
                    </div>

                </b-card-text>

                <b-button @click="showTransactions = !showTransactions"
                        href="#">Показать транзакции</b-button>
            </b-card>

            <b-tabs content-class="mt-3">
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

                <b-tab title="Заработать токены">
                    <div class="wallet-send">
                        <h4>Заработать токены через покупки</h4>

                        <b-form-group label="Выберите партнера">
                            <b-form-select v-model="partner" :options="tokens"></b-form-select>
                        </b-form-group>

                        <h5>Выберите товар</h5>
                        <div class="mb-2">
                            <b-button variant="outline-secondary">Купить товар №1 и получить 10 токенов</b-button>
                        </div>

                        <div class="mb-2">
                            <b-button variant="outline-secondary">Купить товар №2 и получить 50 токенов</b-button>
                        </div>

                        <div class="mb-2">
                            <b-button variant="outline-secondary">Купить товар №3 и получить 100 токенов</b-button>
                        </div>
                    </div>
                </b-tab>

                <b-tab title="Потратить токены">
                    <div class="wallet-send">
                        <h4>Потратить токены через покупки</h4>

                        <b-form-group label="Выберите партнера">
                            <b-form-select v-model="partner" :options="tokens"></b-form-select>
                        </b-form-group>

                        <h5>Выберите товар</h5>
                        <div class="mb-2">
                            <b-button variant="outline-secondary">Купить товар №1 за 10 токенов</b-button>
                        </div>

                        <div class="mb-2">
                            <b-button variant="outline-secondary">Купить товар №2 за 50 токенов</b-button>
                        </div>

                        <div class="mb-2">
                            <b-button variant="outline-secondary">Купить товар №3 за 100 токенов</b-button>
                        </div>
                    </div>
                </b-tab>

                <b-tab title="Создать токен">
                    <div class="token-create" >
                        <h2>Создать токен</h2>

                        <b-form-group
                                label="Название токена"
                                label-for="input-1">
                            <b-form-input id="input-0"
                                          v-model="token.name"
                                          trim>
                            </b-form-input>
                        </b-form-group>

                        <b-form-group
                                label="Символ токена"
                                label-for="input-1">
                            <b-form-input id="input-2"
                                          max-length="4"
                                          v-model="token.symbol"
                                          trim>
                            </b-form-input>
                        </b-form-group>

                        <b-form-group
                                label="Decimals (кол-во знаков после запятой)"
                                label-for="input-1">
                            <b-form-input id="input-3"
                                          v-model="token.decimals"
                                          type="number"
                                          trim>
                            </b-form-input>
                        </b-form-group>

                        <b-form-group
                                label="Общее количество токенов"
                                label-for="input-1">
                            <b-form-input id="input-4"
                                          v-model="token.totalSupply"
                                          type="tel"
                                          trim>
                            </b-form-input>
                        </b-form-group>

                        <b-button @click="createToken">Создать</b-button>
                    </div>

                </b-tab>
                <b-tab title="Взаимодействие с контрактом">
                    <div class="contract-play">
                        <h2>Взаимодействие с контрактом</h2>

                        <b-form-group label="Адрес контракта">
                            <b-form-input id="12"
                                          v-model="contract.address"
                                          trim>
                            </b-form-input>
                        </b-form-group>

                        <b-form-group label="ABI/JSON контракта">
                            <b-form-textarea rows="4"
                                             v-model="contract.abi"
                                             trim>
                            </b-form-textarea>
                        </b-form-group>

                        <b-button @click.prevent="">
                            Продолжить
                        </b-button>
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
  import { mapState, mapActions } from 'vuex'
  import { TOKEN } from '@/config'

  export default {
    name: 'Wallet',

    data: () => ({
      address: '',
      balance: '',
      selectedToken: 'TKN',
      tokens: ['TKN'],
      addressTo: '',
      amount: '',
      isLoading: false,
      showTransactions: false,
      token: {
        name: '',
        symbol: '',
        decimals: '',
        totalSupply: ''
      },
      tokenName: '',
      tokenSymbol: '',
      transactions: [],
      contract: {},
      partner: ['Test partner']
    }),

    computed: {
      ...mapState(['user'])
    },
    methods: {
      ...mapActions(['sendTransaction', 'getUser']),

      async getBalance() {
       let balance = await web3.eth.getBalance(this.address);
       this.balance = web3.utils.fromWei(balance)
      },

      async getToken() {
        let contract = new web3.eth.Contract(TOKEN.ABI, TOKEN.ADDRESS)
        const res = await contract.methods.mint('0x333dcd15AbD50180C56a618Ac240250bB4a2eDA8', 10000).call()
        console.log(res)
        this.tokenName = await contract.methods.name().call()
        this.tokenSymbol = await contract.methods.name().call()
      },

      async createToken() {

      },

      async handleSendTransaction() {
        this.isLoading = true
        const transaction =  {
          to: this.addressTo,
          from: this.address,
          value: web3.utils.toWei(this.amount, 'ether')
        }

        await this.sendTransaction(transaction)

        this.addressTo = ''
        this.amount = ''
        this.isLoading = false
        this.getBalance()
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
    },

    mounted () {
      this.address = sessionStorage.getItem('account')
      this.getBalance()
      this.getToken()
      this.getTransactions()
      this.getUser(this.address)
    }
  }
</script>

<style scoped>
    .wallet-send, .token-create {
        max-width: 400px;
        width: 100%;
    }
</style>