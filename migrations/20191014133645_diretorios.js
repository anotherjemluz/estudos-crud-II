
exports.up = function(knex, Promise) {
  return knex.schema.createTable('diretorios', table => {
    table.increments('id').primary()
    table.string('nome').notNull()
    table.integer('parentId').unsigned().references('id').inTable('diretorios')
  })
};

exports.down = function(knex, Promise) {
  
};
