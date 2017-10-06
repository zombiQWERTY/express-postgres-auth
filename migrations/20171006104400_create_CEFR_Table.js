exports.up = function(knex, Promise) {
  const names = [
    {
      name: 'elementary',
      gradation: 0
    },
    {
      name: 'pre-intermediate',
      gradation: 1
    },
    {
      name: 'intermediate',
      gradation: 2
    },
    {
      name: 'upper-intermediate',
      gradation: 3
    },
    {
      name: 'advanced',
      gradation: 4
    },
    {
      name: 'proficiency',
      gradation: 5
    },
    {
      name: 'fluent',
      gradation: 6
    }
  ];

  return knex
    .schema
    .createTableIfNotExists('CEFR', function(table) {
      table.increments('id').primary();

      table.enum('name', names.map(({ name }) => name)).notNullable();
      table.integer('gradation').notNullable();
    })
    .then(() => knex('CEFR').insert(names));
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('CEFR');
};
