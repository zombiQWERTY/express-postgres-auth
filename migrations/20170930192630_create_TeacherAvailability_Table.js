exports.up = function(knex, Promise) {
  return knex
    .schema
    .createTableIfNotExists('teacherAvailability', function(table) {
      table.increments('id').primary();

      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');

      table.integer('teacher').notNullable();
      table.integer('end').notNullable();
      table.integer('start').notNullable();
      table.integer('dayOfWeek').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('teacherAvailability');
};
