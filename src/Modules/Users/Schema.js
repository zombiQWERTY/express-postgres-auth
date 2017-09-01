import bookshelfMask from 'bookshelf-mask';
import bookshelfSchema from 'bookshelf-schema';
import fields from 'bookshelf-schema/lib/fields';
import bookshelfParanoia from 'bookshelf-paranoia';
import { db } from '../../db';

db.plugin(bookshelfMask);
db.plugin('visibility');
db.plugin(bookshelfSchema());
db.plugin(bookshelfParanoia, { sentinel: 'active' });

export const User = db.Model.extend({
  tableName: 'users',
  softDelete: true,
  hasTimestamps: true,
  hidden: ['password', 'salt']
}, {
  schema: [
    fields.EmailField('email'),
    fields.EncryptedStringField('password'),
    fields.BooleanField('active')
  ]
});
