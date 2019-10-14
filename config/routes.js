/*
    BACKEND - ROTAS

    app.route(endereço)
        .metodoDeRequisição(funçãoUtilizada)
        
*/

module.exports = app => {
    app.route('/pessoas')
        .post(app.api.pessoa.salvar)
        .get(app.api.pessoa.visualizar)

    app.route('/pessoas/:id')
        .put(app.api.pessoa.salvar)
        .get(app.api.pessoa.visualizarPorId)
        .delete(app.api.pessoa.excluir)

    app.route('/diretorios')
        .get(app.api.diretorio.visualizar)
        .post(app.api.diretorio.salvar)

    app.route('/diretorios/tree')
        .get(app.api.diretorio.getTree)

    app.route('/diretorios/:id')
        .put(app.api.diretorio.salvar)
        .get(app.api.diretorio.visualizarPorId)
        .delete(app.api.diretorio.excluir)

}