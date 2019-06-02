<template>
    <div class="container">
        <div class="d-flex align-items-center justify-content-center login">
            <b-card title="Вход для клиентов" class="mr-2">
                <b-button variant="primary" href="#" v-b-modal.modal-login-client>Вход</b-button>
                <span class="p-2">или</span>
                <b-button variant="success" href="#" v-b-modal.modal-reg-client>Регистрация</b-button>
            </b-card>

            <b-card title="Вход для партнеров">
                <b-button variant="primary" href="#" v-b-modal.modal-login-partner>Вход</b-button>
                <span class="p-2">или</span>
                <b-button variant="success" href="#" v-b-modal.modal-reg-partner>Регистрация</b-button>
            </b-card>

            <login-client-modal></login-client-modal>

            <login-partner-modal></login-partner-modal>
        </div>
    </div>

</template>

<script>
  import LoginPartnerModal from './modal/LoginPartnerModal'
  import LoginClientModal from './modal/LoginClientModal'
  import web3 from '../web3'
  import { mapMutations } from 'vuex'

  export default {
    name: 'Login',
    components: {
      LoginPartnerModal,
      LoginClientModal
    },
    data () {
      return {
        account: ''
      }
    },

    methods: {
      ...mapMutations(['setAddress']),

      async getAccount () {
        const accounts = await web3.eth.getAccounts();
        this.account = accounts[0]

        if (!ethereum.isMetaMask) {
          this.$bvToast.toast('', {
            title: 'Для работы с приложением нужно установить MetaMask!',
            variant: 'warning',
            solid: true
          })
          return
        }

        if (!accounts[0]) {
          this.$bvToast.toast('', {
            title: 'Войдите в аккаунт MetaMask!',
            variant: 'warning',
            solid: true
          })
        } else {
          this.setAddress(this.account)
        }
      }
    },

    mounted() {
      this.getAccount()
    }
  }
</script>

<style scoped>
    .login {
        min-height: calc(100vh - 56px);
    }
</style>