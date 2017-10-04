exports.up = function(knex, Promise) {
  return knex
    .schema
    .createTableIfNotExists('teacherLevelLanguageJunction', function(table) {
      table.increments('id').primary();

      table.integer('difficultyLevel').notNullable();
      table.integer('language').notNullable();
      table.integer('teacher').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('teacherLevelLanguageJunction');
};
