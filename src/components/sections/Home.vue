<template lang='pug'>
  div.container
    div.table-wrapper
        div.table-title
            div.row
                div.col-sm-8
                  h2 Painel #[b Pessoas]

                div.col-sm-4

        table(class="table table-bordered")
          thead
            tr
              th Id
              th Nome
              th Login
              th Senha
              th Opções

          tbody
            tr(v-for="pessoa in pessoas")
              td {{ pessoa.id }}
              td {{ pessoa.nome }}
              td {{ pessoa.login }}
              td {{ pessoa.senha.slice(0,8)+'...' }}

              td
                a(class="add" title="Add" data-toggle="tooltip" @click='save')
                  <i class="material-icons">&#xE03B;</i>

                a(class="edit" title="Edit" data-toggle="tooltip" @click='loadPessoa(pessoa, "save", true)')
                  <i class="material-icons">&#xE254;</i>

            tr
              td #[button(class="btn btn-info add-new" @click='save') Adicionar ]
              td #[input(class='form-control' v-model='pessoa.nome')]
              td #[input(class='form-control' v-model='pessoa.login' )]
              td #[input(class='form-control' type='password' v-model='pessoa.senha' )]

              td  
                a(class="edit" title="Edit" data-toggle="tooltip" @click='save')
                  <i class="material-icons">&#xE254;</i>

                a(class="delete" title="Delete" data-toggle="tooltip" @click='remove')
                  <i class="material-icons">&#xE872;</i>

    


</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
  name: 'Home',
  data: function() {
    return {
      mode: 'save', 
      pessoa: {},
      pessoas: [],
      edit: false
    }
  },
   methods: {
    loadPessoa(pessoa, mode = 'save', edit = 'true') {
      this.mode = mode
      this.edit = edit
      this.pessoa = { ...pessoa }
      console.log(this.mode + ' ' + this.edit)
    },
    loadPessoas() {
      // utiliza uma url pra fazer uma requisição com o axios e carregar um array de clientes
      const url = `${baseApiUrl}/pessoas`
      axios.get(url).then(resposta => {
        this.pessoas = resposta.data
        console.log(this.pessoas, this.edit)
      })
    },
    reset() {
      // reseta o modo para 'save' e o usuário atual, carregando os clientes em seguida
      this.mode = 'save'
      this.pessoa = {}
      this.edit = false
      this.loadPessoas()
    },
    save() {
      /* 
        Usa a variável method para fazer a distinção entre os metodos POST e PUT a partir do id do usuário
        (se tem id é PUT, se não tem é POST).
        
        Se houver um ID, será utilizado para atribuir a variavel id o restante da url PUT.
        
        A variável method usada dentro de [ ] - cahamada de um metodo a partir de uma string - determina tbm qual será o tipo de função axios que será utilizada para fazer a requisição, passando como parametro a url eo o cliente em questao.
        
        Se a requisição for bem sucedida, irá aparecer um toasted de sucesso na tela, e em seguida o metodo reset é chamado, renderizando a nova lista de usuários, se não retorna um toasted com a mensagem de erro tratada.
        const method = 'post'
      if (this.edit) { 
        this.method = 'put'
      } else { 
        this.method = 'post'
      }
      console.log('é um ' + this.method + this.edit)
      */
      const method = this.edit ? 'put' : 'post'
      const id = this.edit ? `/${ this.pessoa.id }` : ''
      console.log(method + id)
      console.log(this.pessoa)
      axios[method](`${baseApiUrl}/pessoas${id}`, this.pessoa)
        .then(() => { 
          this.$toasted.global.defaultSucess()
          this.reset()
        })
        .catch(showError)
      this.add = false
    },
    remove() {
      // é uma função mais simples que o save(), que faz uma requisição axios do tipo delete passando a url com o id
      const id = this.pessoa.id
      axios.delete(`${baseApiUrl}/pessoas/${id}`)
        .then(() => {
          this.$toasted.global.defaultSucess()
          this.reset()
        })
        .catch(showError)
    }
  },
  mounted() {
    // executado após o carregamento do componente
    this.loadPessoas()
  }
}
</script>

<style>
body {
    color: #404E67;
    background: #F5F7FA;
    font-family: 'Open Sans', sans-serif;
  }

  .table-wrapper {
    width: 700px;
    margin: 30px auto;
    background: #fff;
    padding: 20px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  }

  .table-title {
    padding-bottom: 10px;
    margin: 0 0 10px;
  }

  .table-title h2 {
    margin: 6px 0 0;
    font-size: 22px;
  }

  .table-title .add-new {
    float: right;
    height: 30px;
    font-weight: bold;
    font-size: 12px;
    text-shadow: none;
    min-width: 100px;
    border-radius: 50px;
    line-height: 13px;
  }

  .table-title .add-new i {
    margin-right: 4px;
  }

  table.table {
    table-layout: fixed;
  }

  table.table tr th,
  table.table tr td {
    border-color: #e9e9e9;
  }

  table.table th i {
    font-size: 13px;
    margin: 0 5px;
    cursor: pointer;
  }

  table.table th:last-child {
    width: 100px;
  }

  table.table td a {
    cursor: pointer;
    display: inline-block;
    margin: 0 5px;
    min-width: 24px;
  }

  table.table td a.add {
    color: #27C46B;
  }

  table.table td a.edit {
    color: #FFC107;
  }

  table.table td a.delete {
    color: #E34724;
  }

  table.table td i {
    font-size: 19px;
  }

  table.table td a.add i {
    font-size: 24px;
    margin-right: -1px;
    position: relative;
    top: 3px;
  }

  table.table .form-control {
    height: 32px;
    line-height: 32px;
    box-shadow: none;
    border-radius: 2px;
  }

  table.table .form-control.error {
    border-color: #f50000;
  }

  table.table td .add {
    display: none;
  }
</style>