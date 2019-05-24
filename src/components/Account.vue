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
                    <transfer-funds :address="address"></transfer-funds>

                </b-tab>

                <b-tab title="Заработать баллы" v-if="!isPartner">
                    <div class="wallet-send">
                        <h4>Заработать баллы через покупки</h4>

                        <b-form-group label="Выберите партнера">
                            <b-form-select v-model="selectedPartner"
                                           :options="partners"
                                           text-field="name"
                                           value-field="address">
                            </b-form-select>
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

                <b-tab title="Потратить баллы" v-if="!isPartner">
                    <div class="wallet-send">
                        <h4>Потратить баллы через покупки</h4>

                        <b-form-group label="Выберите партнера">
                            <b-form-select v-model="selectedPartner"
                                           :options="partners"
                                           text-field="name"
                                           value-field="address">
                            </b-form-select>
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

                        <table class="table table-hover">
                            <thead>
                                <th>Сумма</th>
                                <th>Тип</th>
                                <th>Адрес клиента</th>
                                <th>Адрес партнера</th>
                            </thead>
                            <tbody>
                                <tr v-for="(transaction, key) in transactions" :key="key">
                                    <td>{{ transaction.points }}</td>
                                    <td>{{ transaction.trasactionType }}</td>
                                    <td>{{ transaction.memberAddress }}</td>
                                    <td>{{ transaction.partnerAddress }}</td>
                                </tr>
                            </tbody>
                        </table>
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
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { TOKEN } from '@/config'
  import TransferFunds from './TransferFunds'
  import { userType } from '@/constants'

  export default {
    name: 'Account',

    components: {
      TransferFunds
    },

    data: () => ({
      address: '',
      balance: '',
      isLoading: false,
      showTransactions: false,
      tokenName: '',
      tokenSymbol: 'ETH',
      transactions: [],
      contractTransactions: [],
      partners: [],
      selectedPartner: null
    }),

    computed: {
      ...mapState(['user']),
      ...mapGetters(['userType']),

      isPartner () {
        return this.userType === userType.PARTNER
      }
    },

    methods: {
      ...mapActions(['sendTransaction', 'getClientInfo', 'getPartnerList',
        'earnPoints', 'usePoints', 'getTransactionsInfo']),

      async getBalance() {
       let balance = await web3.eth.getBalance(this.address);
       this.balance = await web3.utils.fromWei(balance)
      },

      async getToken() {
        let contract = new web3.eth.Contract(TOKEN.ABI, TOKEN.ADDRESS)
        const res = await contract.methods.mint(this.address, 10000).call()
        console.log(res)
        this.tokenName = await contract.methods.name().call()
        this.tokenSymbol = await contract.methods.symbol().call()
      },

      async getPartners() {
        const partners = await this.getPartnerList()
        this.partners = partners.map(partner => {
          return {
            name: partner[0],
            address: partner[1]
          }
        })
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
        await this.getClientInfo()
      },

      async buyProductForToken(points) {
        const data = {
          points,
          partnerAddress: this.selectedPartner
        }
        await this.usePoints(data)
      },

      async getTransactionInfo() {
        this.contractTransactions = await this.getTransactionsInfo()
      }
    },

    mounted () {
      this.address = sessionStorage.getItem('account')
      this.getBalance()
      this.getToken()
      this.getPartners()
      if (!this.isPartner) {
        this.getClientInfo()
        this.getTransactions()
      } else {
        this.getTransactionInfo()
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