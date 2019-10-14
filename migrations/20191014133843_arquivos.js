
exports.up = function(knex, Promise) {
  return knex.schema.createTable('arquivos', table => {
    table.increments('id').primary()
    table.string('nome').notNull()
    table.integer('diretorioId').unsigned().references('id').inTable('diretorios')
  })
};

exports.down = function(knex, Promise) {
  
};
