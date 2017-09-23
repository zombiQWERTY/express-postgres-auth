import { pbkdf2 } from '../src/Modules/Hashes/consts';

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('salt').notNullable();
      table.string('email').unique().notNullable();
      table.string('password', pbkdf2.keylen * 2).notNullable();
      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');
      table.boolean('active');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('users');
};
