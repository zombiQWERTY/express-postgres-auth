import knex from 'knex';
import bookshelf from 'bookshelf';
import config from '../../config/knex.json';
import { NODE_ENV } from '../utils/NODE_ENV';

let database = bookshelf(knex(config[NODE_ENV]));
database.plugin('registry');

// export const createDBConnection = config => {
//   const db = bookshelf(knex(config));
//   db.plugin('registry');
//
//   database = db;
//   return database;
// };
//
export { database as db };
