exports.up = function(knex, Promise) {
  return knex
    .schema
    .createTableIfNotExists('teacherLanguageCEFRJunction', function(table) {
      table.increments('id').primary();

      table.integer('CEFR').notNullable();
      table.integer('teacher').notNullable();
      table.integer('language').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('teacherLanguageCEFRJunction');
};
