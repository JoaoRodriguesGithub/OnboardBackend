exports.up = (knex) => {
  return knex.schema.createTable('roles', (t) => {
    t.increments('id').primary();
    t.string('roleName').notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('roles');
};
