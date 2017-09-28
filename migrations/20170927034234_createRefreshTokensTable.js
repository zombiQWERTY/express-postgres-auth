exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('refreshTokens', function(table) {
      table.boolean('active');
      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');
      table.increments('id').primary();
      table.integer('userId').notNullable();
      table.string('clientId').notNullable();
      table.dateTime('expiresIn').notNullable();
      table.string('refreshToken').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('refreshTokens');
};
