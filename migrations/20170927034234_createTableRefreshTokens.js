exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('refreshTokens', function(table) {
      table.boolean('active');
      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');
      table.increments('id').primary();
      table.string('clientId').notNullable();
      table.dateTime('expiresIn').notNullable();
      table.string('refreshToken').notNullable();
      table.integer('user_id').references('users.id');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('refreshTokens');
};
