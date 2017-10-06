import R from 'ramda';
import { pbkdf2 } from '../src/Modules/Hashes/consts';
import { teacherAccountLevel } from '../src/Modules/Cards/consts';
import { types as lessonTypes } from '../src/Modules/Lessons/consts.js';

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

      // Админ или супервайзер заполняет какого типа уроки может вести учитель (групповые, индивидуальные, и те, и те)
      table.enum('lessonsType', R.append('all', R.keys(lessonTypes.toJSON())));

      table.enum('accountLevel', R.values(teacherAccountLevel.toJSON()));
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('teachers');
};
