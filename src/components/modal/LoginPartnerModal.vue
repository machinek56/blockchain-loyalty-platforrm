<template>
    <div>
        <b-modal id="modal-reg-partner" ref="modal-reg-partner"
                 title="Регистрация для партнеров" hide-footer>
            <b-form>
                <b-form-group
                        id="input-group-2"
                        label="Имя партнера"
                        label-for="input-1"
                >
                    <b-form-input
                            id="input-2"
                            v-model="form.name"
                            placeholder=""
                    ></b-form-input>
                </b-form-group>
                <b-button variant="success"
                          class="justify-content-end"
                          @click="onSubmitReg">
                    Зарегистрироваться
                </b-button>
            </b-form>
        </b-modal>

        <b-modal id="modal-login-partner" ref="modal-login-partner"
                 title="Вход для партнеров" hide-footer>
            <b-form @submit="login">
                <b-form-group label="Введите имя">
                    <b-form-input
                            v-model="form.name"
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
  import { userType } from '@/constants'

  export default {
    name: 'LoginPartnerModal',
    data: () => ({
      form: {
        name: ''
      }
    }),

    methods: {
      ...mapActions(['registerPartner']),
      ...mapMutations(['setUserType']),

      async onSubmitReg(e) {
        e.preventDefault()
        if (!this.form.name) return

        await this.registerPartner(this.form.name)
        this.hideModal('modal-reg-partner')
      },

      login() {
        this.setUserType(userType.PARTNER)
        this.$router.push('/account')
      },

      hideModal(ref) {
        this.$refs[ref].hide()
      }
    }
  }
</script>

<style scoped>

</style>