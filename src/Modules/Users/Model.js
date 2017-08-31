import bookshelfMask from 'bookshelf-mask';
import bookshelfParanoia from 'bookshelf-paranoia';
import bookshelfSchema from 'bookshelf-schema';
import scope from 'bookshelf-schema/lib/scopes';
import fields from 'bookshelf-schema/lib/fields';
import relations from 'bookshelf-schema/lib/relations';
import { Store } from '../../Start/ConnectionsStore';

(() => {
  const DB = Store.get('db');

  DB.plugin(bookshelfMask);
  DB.plugin('visibility');
  DB.plugin(bookshelfSchema());
  DB.plugin(bookshelfParanoia, { sentinel: 'active' });

  const Model = DB.Model.extend({
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

  console.log(123);
  Store.add('models.User', Model);
})();
