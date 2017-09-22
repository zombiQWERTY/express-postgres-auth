import { pbkdf2 } from '../src/Modules/Hashes/consts';

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('salt');
      table.string('email');
      table.string('password', pbkdf2.keylen * 2);
      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');
      table.boolean('active');

      table.unique(['email'])
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('users');
};
