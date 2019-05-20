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


            <b-modal id="modal-reg-client" ref="modal-reg-client"
                     title="Регистрация для клиентов" hide-footer>
                <b-form @submit="onSubmitRegClient">
                    <b-form-group label="ФИО">
                        <b-form-input v-model="formUser.fullName">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group label="Телефон">
                        <b-form-input v-model="formUser.phone" type="tel">
                        </b-form-input>
                    </b-form-group>

                    <b-button variant="success" @click="onSubmitRegClient">
                        Зарегистрироваться
                    </b-button>
                </b-form>
            </b-modal>

            <b-modal id="modal-login-client" ref="modal-login-client"
                     title="Вход для клиентов" hide-footer>
                <b-form @submit="login">
                    <b-form-group label="Введите адрес кошелька">
                        <b-form-input
                                v-model="formUser.address"
                                type="text"
                                placeholder=""
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Введите пароль">
                        <b-form-input
                                v-model="formUser.password"
                                type="password"
                                placeholder=""
                        ></b-form-input>
                    </b-form-group>
                    <b-button variant="success" @click="login">
                        Войти
                    </b-button>
                </b-form>
            </b-modal>

            <b-modal id="modal-reg-partner" ref="modal-reg-client"
                     title="Регистрация для партнеров" hide-footer>
                <b-form @submit="onSubmitRegPartner">
                    <b-form-group
                            id="input-group-2"
                            label="Создайте пароль:"
                            label-for="input-1"
                    >
                        <b-form-input
                                id="input-2"
                                v-model="formPartner.password"
                                type="password"
                                placeholder="Создайте пароль"
                        ></b-form-input>
                    </b-form-group>
                    <b-button variant="success" @click="onSubmitRegPartner">
                        Зарегистрироваться
                    </b-button>
                </b-form>
            </b-modal>

            <b-modal id="modal-login-partner" ref="modal-login-partner"
                     title="Вход для партнеров" hide-footer>
                <b-form @submit="login">
                    <b-form-group label="Введите пароль">
                        <b-form-input
                                v-model="formPartner.password"
                                type="password"
                                placeholder=""
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group label="Введите адрес кошелька">
                        <b-form-input
                                v-model="formPartner.address"
                                type="text"
                                placeholder=""
                        ></b-form-input>
                    </b-form-group>
                    <b-button variant="success" @click="login">
                        Войти
                    </b-button>
                </b-form>
            </b-modal>
        </div>
    </div>

</template>

<script>
  import web3 from '../web3'
  import { mapActions } from 'vuex'

  export default {
    name: 'Login',

    data () {
      return {
        formUser: {
          fullName: '',
          phone: ''
        },
        formPartner: {
          name: ''
        },
        account: '',
      }
    },

    methods: {
      ...mapActions(['registerUser']),

      hideModal(ref) {
        this.$refs[ref].hide()
      },
      async onSubmitRegClient(e) {
        e.preventDefault()
        const regData = {
          address: this.account,
          userType: 'CLIENT',
          fullName: this.formUser.fullName,
          phone: this.formUser.phone
        }
        await this.registerUser(regData)
        this.$refs['modal-reg-client'].hide()
      },

      onSubmitRegPartner(e) {
        e.preventDefault()
      },

      login() {
        if (web3.eth.accounts) {
          this.$router.push('/wallet')
        }
      },

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