<template>
    <div class="container">
        <div class="mt-4 d-flex">
           <account-info
                   :is-partner="isPartner">
           </account-info>

            <b-tabs content-class="mt-3" >
                <b-tab title="Перевести средства" active>
                    <transfer-funds></transfer-funds>
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

                <b-tab title="Показать транзакции" v-if="!isPartner">
                    <div style="max-width: 800px;">
                        <h2>Транзакции</h2>

                        <table class="table table-hover" v-if="transactions.length">
                            <thead>
                                <th>Hash</th>
                                <th>Gas used</th>
                                <th>From</th>
                                <th>To</th>
                            </thead>
                            <tbody>
                                <tr v-for="(transaction, key) in transactions" :key="key">
                                    <td :title="transaction.hash">{{ truncateString(transaction.hash) }}</td>
                                    <td>{{ transaction.gasUsed }}</td>
                                    <td :title="transaction.from">{{ truncateString(transaction.from) }}</td>
                                    <td :title="transaction.to">{{ truncateString(transaction.to) }}</td>
                                </tr>
                            </tbody>
                        </table>
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
                                <tr v-for="(transaction, key) in contractTransactions" :key="key">
                                    <td>{{ transaction.points }}</td>
                                    <td>{{ transaction.transactionType }}</td>
                                    <td :title="transaction.memberAddress">{{ truncateString(transaction.memberAddress) }}</td>
                                    <td :title="transaction.partnerAddress">{{ truncateString(transaction.partnerAddress) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </b-tab>
            </b-tabs>

        </div>
    </div>
</template>

<script>
  import web3 from '../web3'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import TransferFunds from './TransferFunds'
  import AccountInfo from './AccountInfo'
  import { userType } from '@/constants'

  export default {
    name: 'Account',

    components: {
      TransferFunds,
      AccountInfo
    },

    data: () => ({
      transactions: [],
      contractTransactions: [],
      partners: [],
      selectedPartner: null
    }),

    computed: {
      ...mapGetters(['userType']),
      ...mapState(['address']),

      isPartner () {
        return this.userType === userType.PARTNER
      }
    },

    methods: {
      ...mapActions(['sendTransaction', 'getPartnerList', 'earnPoints', 'usePoints', 'getTransactionsInfo']),

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
        const transactions = await this.getTransactionsInfo()
        this.contractTransactions = transactions.map(item => {
            return {
              points: item[0].toNumber(),
              transactionType: item[1] === 0 ? 'Начисление' : 'Погашение',
              memberAddress: item[2],
              partnerAddress: item[3]
            }
        }).filter(item => item.partnerAddress === this.address)
      },

      truncateString(str, length = 15) {
        if (!str) return
        return str.substring(0, length) + '...'
      }
    },

    mounted () {
      this.getPartners()
      if (!this.isPartner) {
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