<template lang="pug">
  nav(class="site-navbar js-sticky-header site-navbar-target" role="banner")

</template>

<script>
import { mapState } from "vuex";
import { userKey } from '@/global'
export default {
  name: "Menu",
  computed: mapState(["isMenuVisible"]),
  data() {
    return {
      generic: 'Login / Cadastro ',
      welcome: 'Olá, ',
      user: {}
    };
  },
  methods: {
    toggleLineHome(e) {
      // this.isHome = !this.isHome
      // console.log('isHome = ' + this.isHome)
      // console.log('isQuem = ' + this.isQuem)
      console.log(e);
    },
    logOut(){
      localStorage.removeItem(userKey)
    },
    updateCart(id) {
      this.cart.push(id)
    }
  },
  computed: {
    // updateCart() {
      // return localStorage.getItem('carrinho').length
    // }
  }
};
</script>

<style lang="scss">
</style>