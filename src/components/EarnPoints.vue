<template>
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
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    name: 'EarnPoints',
    props: {
      partners: Array
    },
    data: () => ({
      selectedPartner: ''
    }),
    methods: {
      ...mapActions(['earnPoints', 'getClientInfo']),

      async buyProduct(points) {
        const data = {
          points,
          partnerAddress: this.selectedPartner
        }
        await this.earnPoints(data)
        this.getClientInfo()
      },
    }
  }
</script>

<style scoped>

</style>