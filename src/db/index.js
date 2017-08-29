import knex from 'knex';
import bookshelf from 'bookshelf';

let db = null;
export const createDBConnection = config => {
  db = bookshelf(knex(config));

  return db;
};

export { db };
