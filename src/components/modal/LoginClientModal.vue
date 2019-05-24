<template>
    <div>
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
                <b-form-group label="Введите номер телефона">
                    <b-form-input
                            v-model="formUser.phone"
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
</template>

<script>
  import { mapActions, mapMutations } from 'vuex'

  export default {
    name: 'LoginClientModal',

    data: () => ({
      formUser: {
        fullName: '',
        phone: ''
      }
    }),

    methods: {
      ...mapActions(['registerUser']),
      ...mapMutations(['setUserType']),

      hideModal(ref) {
        this.$refs[ref].hide()
      },

      async onSubmitRegClient(e) {
        e.preventDefault()
        const regData = {
          fullName: this.formUser.fullName,
          phone: this.formUser.phone
        }
        await this.registerUser(regData)
        this.hideModal('modal-reg-client')
      },

      login () {
        this.setUserType('CLIENT')
        this.$router.push('/account')
      }
    }
  }
</script>

<style scoped>

</style>