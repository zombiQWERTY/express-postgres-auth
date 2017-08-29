import knex from 'knex';
import bookshelf from 'bookshelf';

export const db = config => bookshelf(knex(config));
