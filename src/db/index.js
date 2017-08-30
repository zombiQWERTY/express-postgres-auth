import knex from 'knex';
import bookshelf from 'bookshelf';

let database = null;
export const createDBConnection = config => {
  const db = bookshelf(knex(config));
  db.plugin('registry');

  database = db;
  return database;
};

export { database as db };
