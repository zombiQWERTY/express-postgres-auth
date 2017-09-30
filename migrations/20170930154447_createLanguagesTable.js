exports.up = function(knex, Promise) {
  const basicLanguages = [
    {
      code: '570',
      local: 'Русский',
      international: 'Russian'
    },{
      code: '045',
      local: 'English',
      international: 'English'
    },{
      code: '745',
      local: 'Français',
      international: 'French'
    },{
      code: '235',
      local: 'Italiano',
      international: 'Italian'
    },{
      code: '315',
      local: '中文',
      international: 'Chinese'
    }
  ];

  return knex
    .schema
    .createTableIfNotExists('languages', function(table) {
      table.increments('id').primary();
      table.string('code').notNullable();
      table.string('local').notNullable();
      table.string('international').notNullable();
    })
    .then(() => knex('languages').insert(basicLanguages));
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('languages');
};
