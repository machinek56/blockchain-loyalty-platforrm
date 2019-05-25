<template>
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
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'UsePoints',

    props: {
      partners: Array
    },

    data: () => ({
      selectedPartner: ''
    }),

    methods: {
      ...mapActions(['usePoints']),

      async buyProductForToken(points) {
        const data = {
          points,
          partnerAddress: this.selectedPartner
        }
        await this.usePoints(data)
      },
    }
  }
</script>

<style scoped>

</style>