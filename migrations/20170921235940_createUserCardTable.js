import R from 'ramda';
import { userAccountLevel } from '../src/Modules/Card/consts';

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('userCard', function(table) {
      table.boolean('active');
      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('phone').notNullable();
      table.string('lastname').notNullable();
      table.string('email').unique().notNullable();
      table.enum('accountLevel', R.keys(userAccountLevel.toJSON()));
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('userCard');
};
