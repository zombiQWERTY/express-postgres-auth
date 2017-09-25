import R from 'ramda';
import { pbkdf2 } from '../src/Modules/Hashes/consts';
import { accountLevel } from '../src/Modules/Users/consts';

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', function(table) {
      table.boolean('active');
      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('salt').notNullable();
      table.string('phone').notNullable();
      table.string('lastname').notNullable();
      table.string('email').unique().notNullable();
      table.string('password', pbkdf2.keylen * 2).notNullable();
      table.enum('accountLevel', R.keys(accountLevel.toJSON()));
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('users');
};
