<template lang='pug'>
  div.container.table-wrapper#ui
    div
      div.table-title
        div.row
          div.col-sm-12
            h2 Trabalho 2: #[b File Manager]

          div.col-sm-4

    div.row
      div.col-sm-2.usuarios-div
        p Usuários
        add(v-for="pessoa in pessoas")
          li.pauta #[a - {{ pessoa.login }}]
      
      div.col-sm-2.diretorios-div
        p Diretórios
        Tree(:data='treeData' :options='treeOptions' ref='tree' style='color: black;' class='col-sm-12')
    
      div.col-sm-6.arquivos-div
        p Arquivos {{ diretorio.path }}
        a(src='/uploads/img-1571142770329.png' download) /uploads/img-1571142770329.png
        

    div.row
      div.col-sm-1 #[button(class="btn btn-info add-new" @click='saveDiretorio') Adicionar ]
      div.col-sm-2 #[input(class='form-control' placeholder='Nome do Diretorio' v-model='diretorio.nome')]
      div.col-sm-2 #[input(class='form-control' placeholder='Diretorio Pai (opcional)' v-model='diretorio.parentId' )]

      div.col-sm-1
        a(class="sucess" title="Sucess" data-toggle="tooltip" @click='saveDiretorio')
          <i class="material-icons">&#xE254;</i>

        a(class="delete" title="Delete" data-toggle="tooltip" @click='removeDiretorio')
          <i class="material-icons">&#xE872;</i>

      Upload

      

</template>

<script>
import { mapState } from 'vuex'
import Tree from 'liquor-tree'
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'
import Upload from './Upload'

export default {
  name: 'PainelDiretorio',
  components: { Tree, Upload },
  data: function() {
    return {
      mode: 'save', 
      pessoa: {},
      pessoas: [],
      diretorio: {},
      diretorios: [],
      edit: false,
      treeData: this.getTreeData(),
      treeOptions: {
        propertyNames: { 'text': 'nome' }
      }
    }
  },
   methods: {
    getTreeData() {
      const url = `${baseApiUrl}/diretorios/tree`
      return axios.get(url).then(res => res.data)
    },
    onNodeSelect(node) {
      this.$router.push({
        name: 'arquivosPorDiretorio',
        params: { id: node.id }
      })
    },
    loadPessoa(pessoa, mode = 'save', edit = 'true') {
      this.mode = mode
      this.edit = edit
      this.pessoa = { ...pessoa }
    },
    loadDiretorio(diretorio, mode = 'save', edit = 'true') {
      this.mode = mode
      this.edit = edit
      this.diretorio = { ...diretorio }
    },
    loadAllData() {
      // utiliza uma url pra fazer uma requisição com o axios e carregar um array de clientes
      const url = `${baseApiUrl}/pessoas`
      axios.get(url).then(resposta => {
        this.pessoas = resposta.data
      })

      const url2 = `${baseApiUrl}/diretorios`
      axios.get(url2).then(resposta => {
        this.diretorios = resposta.data
      })
    },
    reset() {
      // reseta o modo para 'save' e o usuário atual, carregando os clientes em seguida
      this.mode = 'save'
      this.pessoa = {}
      this.diretorio = {}
      this.edit = false
      this.loadAllData()
    },
    saveDiretorio() {
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
      const id = this.edit ? `/${ this.diretorio.id }` : ''
      console.log(method + id)
      console.log(this.diretorio)
      axios[method](`${baseApiUrl}/diretorios${id}`, this.diretorio)
        .then(() => { 
          this.$toasted.global.defaultSucess()
          this.reset()
        })
        .catch(showError)
      this.add = false
    },
    removeDiretorio() {
      // é uma função mais simples que o save(), que faz uma requisição axios do tipo delete passando a url com o id
      const id = this.diretorio.id
      axios.delete(`${baseApiUrl}/diretorios/${id}`)
        .then(() => {
          this.$toasted.global.defaultSucess()
          this.reset()
        })
        .catch(showError)
    }
  },
  watch: {
    $route(to) {
      this.diretorio.id = to.params.id
      this.arquivos = []
      this.page = 1
      this.loadMore = true

      this.getCategory()
      this.getArquivos()
    }
  },
  mounted() {
    // executado após o carregamento do componente
    this.loadAllData()
    this.$refs.tree.$on('node:selected', this.onNodeSelect)
  }
};
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

  .pauta { margin: 20px 20px 20px 20px; list-style-type: none; }

  div .tree-node { color: black; background-color: transparent;}

  #ui { width: 80vw; }

  .usuarios-div, .diretorios-div, .arquivos-div { min-height: 300px; }
  .usuarios-div > p, .diretorios-div > p, .arquivos-div > p { border-bottom: 1px solid  gray; }

  .usuarios-div { padding: 20px; margin: 20px; }
  .diretorios-div { padding: 20px; margin: 20px; }
  .arquivos-div {  padding: 20px; margin: 20px; }
</style>