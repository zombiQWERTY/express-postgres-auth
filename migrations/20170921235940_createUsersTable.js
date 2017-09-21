exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('email');
      table.string('password');
      table.integer('deleted_at');
      table.string('salt');
      table.boolean('active');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('users');
};
