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
}