import R from 'ramda';
import { accountLevel } from '../src/Modules/Cards/consts';

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('studentCards', function(table) {
      table.string('phone');
      table.boolean('active');
      table.string('lastname');
      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.enum('accountLevel', R.values(accountLevel.student.toJSON()));
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('studentCards');
};
