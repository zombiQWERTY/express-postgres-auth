import knex from 'knex';
import bookshelf from 'bookshelf';

export const createDBConnection = config => {
  const db = bookshelf(knex(config));
  db.plugin('registry');

  return db;
};
