exports.up = function(knex, Promise) {
  const basicLevels = [
    { difficultyLevel: 0 },
    { difficultyLevel: 1 },
    { difficultyLevel: 2 },
    { difficultyLevel: 3 },
    { difficultyLevel: 4 },
    { difficultyLevel: 5 }
  ];

  return knex
    .schema
    .createTableIfNotExists('difficultyLevels', function(table) {
      table.increments('id').primary();

      table.integer('difficultyLevel').notNullable();
      table.boolean('active').defaultTo(true);
    })
    .then(() => knex('difficultyLevels').insert(basicLevels));
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('difficultyLevels');
};
