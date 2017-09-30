import R from 'ramda';
import { accountLevel } from '../src/Modules/Cards/consts';

exports.up = function(knex, Promise) {
  return knex.schema
    .createTableIfNotExists('teacherCards', function(table) {
      table.boolean('active');
      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('phone').notNullable();
      table.integer('UTCOffset').notNullable();
      table.string('familyName').notNullable();
      table.string('email').unique().notNullable();
      table.enum('accountLevel', R.values(accountLevel.teacher.toJSON()));
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('teacherCards');
};
