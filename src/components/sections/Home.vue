<template lang='pug'>
  div.content
    PainelPessoas.table-wrapper
    PainelDiretorio.table-wrapper

</template>

<script>
import PainelPessoas from './PainelPessoas'
import PainelDiretorio from './PainelDiretorio'

export default {
  name: 'Home',
  components: { PainelPessoas, PainelDiretorio }
  
}
</script>

<style>

</style>