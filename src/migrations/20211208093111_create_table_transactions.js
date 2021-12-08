exports.up = (knex, Promise) => {
  return Promise.all(
    knex.schema.createTable('transactions', (t) => {
      t.increments('id').primary();
      t.integer('user_id')
        .references('id')
        .inTable('users')
        .notNull();
      t.date('date').notNull();
      t.integer('category_id')
        .references('id')
        .inTable('categories')
        .notNull();
      t.decimal('amount', 15, 2).notNull();
    }),
  );
};

exports.down = (knex) => {
  return knex.schema.dropTable('transactions');
};
