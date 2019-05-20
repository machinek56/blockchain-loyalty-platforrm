<template>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="#">Платформа лояльности</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <span style="color: #dddddd" class="mr-3">Network: {{network}}</span>
<!--                <span style="color: #fff;">{{account}}</span>-->
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
  import web3 from '../web3'

  export default {
    name: 'AppHeader',
    data () {
      return {
        account: '',
        network: ''
      }
    },
    methods: {
      async getNetwork () {
        this.network = await web3.eth.net.getNetworkType()
      }
    },
    mounted() {
      this.getNetwork()
    }
  }
</script>

<style scoped>

</style>