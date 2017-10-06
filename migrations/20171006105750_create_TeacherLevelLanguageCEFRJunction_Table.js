exports.up = function(knex, Promise) {
  return knex
    .schema
    .createTableIfNotExists('teacherLevelLanguageCEFRJunction', function(table) {
      table.increments('id').primary();

      table.integer('teacher').notNullable();
      table.integer('languageCEFR').notNullable();
      table.integer('difficultyLevel').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('teacherLevelLanguageCEFRJunction');
};
