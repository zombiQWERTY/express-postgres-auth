import R from 'ramda';
import { pbkdf2 } from '../src/Modules/Hashes/consts';
import { teacherAccountLevel } from '../src/Modules/Cards/consts';

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('teachers', function(table) {
      table.increments('id').primary();

      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');

      table.string('salt').notNullable();
      table.string('password', pbkdf2.keylen * 2).notNullable();

      table.string('phone');
      table.string('email').unique().notNullable();

      table.string('familyName');
      table.string('firstName').notNullable();

      table.integer('UTCOffset').notNullable();
      table.enum('accountLevel', R.values(teacherAccountLevel.toJSON()));
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('teachers');
};
