import bookshelfMask from 'bookshelf-mask';
import bookshelfSchema from 'bookshelf-schema';
import fields from 'bookshelf-schema/lib/fields';
import bookshelfParanoia from 'bookshelf-paranoia';
import { Store } from '../../Start/ConnectionsStore';

export const createModel = () => {
  const DB = Store.get('db');
  const Student = Store.get('Models.Student');

  DB.plugin(bookshelfMask);
  DB.plugin('visibility');
  DB.plugin(bookshelfSchema());
  DB.plugin(bookshelfParanoia, { field: 'deletedAt', sentinel: 'active' });

  const Model = DB.Model.extend({
    tableName: 'studentCards',
    softDelete: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
    hidden: ['credentials', 'deletedAt', 'createdAt', 'updatedAt'],
    credentials: function () {
      return this.hasOne(Student);
    }
  }, {
    schema: [
      fields.BooleanField('active'),
      fields.IntField('credentials'),
      fields.StringField('phone', { required: true }),
      fields.StringField('accountLevel', { required: true }),
      fields.EmailField('email', { required: true, maxLength: 64 }),
      fields.StringField('name', { required: true, maxLength: 32 }),
      fields.StringField('familyName', { required: true, maxLength: 32 })
    ]
  });

  Store.add('Models.Cards.Student', Model);
};
