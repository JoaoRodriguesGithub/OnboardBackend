exports.up = (knex) => {
  return knex.schema.createTable('categories', (t) => {
    t.increments('id').primary();
    t.string('categoryName').notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('categories');
};
