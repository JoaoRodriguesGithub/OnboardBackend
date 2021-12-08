exports.up = (knex) => {
  return knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.integer('company_id')
      .references('id')
      .inTable('companies')
      .notNull();
    t.string('name').notNull();
    t.string('email').notNull().unique();
    t.string('password').notNull();
    t.integer('role_id')
      .references('id')
      .inTable('roles')
      .notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
