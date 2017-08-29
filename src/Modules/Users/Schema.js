import { db } from '../../db';

const User = db.Model.extend({
  tableName: 'users'
});
