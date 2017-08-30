import bookshelfMask from 'bookshelf-mask';
import bookshelfParanoia from 'bookshelf-paranoia';
import bookshelfSchema from 'bookshelf-schema';
import scope from 'bookshelf-schema/lib/scopes';
import fields from 'bookshelf-schema/lib/fields';
import relations from 'bookshelf-schema/lib/relations';
import { db } from '../../db';

db.plugin(bookshelfMask);
db.plugin('visibility');
db.plugin(bookshelfSchema());
db.plugin(bookshelfParanoia, { sentinel: 'active' });

export const createUserModel = db.Model.extend({
  tableName: 'users',
  softDelete: true,
  hasTimestamps: true,
  hidden: ['password', 'salt']
}, {
  schema: [
    fields.EmailField('email'),
    fields.EncryptedStringField('password'),
    fields.BooleanField('active'),
    relations.HasMany('Photo'),
    scope('isActive', function(){ return this.where({active: true}); })
  ]
});
