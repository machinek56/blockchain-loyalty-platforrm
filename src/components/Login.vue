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
      async getAccount () {
        const accounts = await web3.eth.getAccounts();
        this.account = accounts[0]
        if (!accounts[0]) {
          alert('Войдите в аккаунт MetaMask!')
        }
        sessionStorage.setItem('account', this.account)
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