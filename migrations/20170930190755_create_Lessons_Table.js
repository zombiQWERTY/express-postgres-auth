import R from 'ramda';
import { types, statuses } from '../src/Modules/Lessons/consts.js';

exports.up = function(knex, Promise) {
  return knex
    .schema
    .createTableIfNotExists('lessons', function(table) {
      table.increments('id').primary();

      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');

      table.integer('end').notNullable();
      table.integer('start').notNullable();
      table.integer('dayOfWeek').notNullable();

      table.integer('teacher').notNullable();
      table.integer('language').notNullable();
      table.integer('difficultyLevel').notNullable();

      table.dateTime('startTime').notNullable();
      table.enum('type', R.keys(types.toJSON())).notNullable();
      table.enum('status', R.keys(statuses.toJSON())).notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('lessons');
};
