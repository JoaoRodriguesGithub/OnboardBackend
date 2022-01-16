exports.up = (knex) => {
  return knex.schema.createTable('companies', (t) => {
    t.increments('id').primary();
    t.string('companyName').notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('companies');
};
