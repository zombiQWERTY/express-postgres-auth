import R from 'ramda';

exports.up = function(knex, Promise) {
  const daysRange = R.range(1, 8);
  const hoursRange = R.range(1, 25);
  return knex
    .schema
    .createTableIfNotExists('teacherAvailability', function(table) {
      table.boolean('active');
      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');
      table.increments('id').primary();
      table.integer('teacher').notNullable();
      table.enum('end', hoursRange).notNullable();
      table.enum('start', hoursRange).notNullable();
      table.enum('dayOfWeek', daysRange).notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('teacherAvailability');
};
