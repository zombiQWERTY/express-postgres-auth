import { pbkdf2 } from '../src/Modules/Hashes/consts';

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('teachers', function(table) {
      table.boolean('active');
      table.dateTime('deletedAt');
      table.dateTime('createdAt');
      table.dateTime('updatedAt');
      table.increments('id').primary();
      table.string('salt').notNullable();
      table.integer('teacherCard_id').unique().references('teacherCards.id');
      table.string('password', pbkdf2.keylen * 2).notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('teachers');
};
