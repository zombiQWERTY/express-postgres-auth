import bookshelfMask from 'bookshelf-mask';
import bookshelfSchema from 'bookshelf-schema';
import fields from 'bookshelf-schema/lib/fields';
import bookshelfParanoia from 'bookshelf-paranoia';
import { Store } from '../../Start/ConnectionsStore';

export const createModel = () => {
  const DB = Store.get('db');
  const Teacher = Store.get('Models.Teacher');

  DB.plugin(bookshelfMask);
  DB.plugin('visibility');
  DB.plugin(bookshelfSchema());
  DB.plugin(bookshelfParanoia, { field: 'deletedAt', sentinel: 'active' });

  const Model = DB.Model.extend({
    tableName: 'teacherCards',
    softDelete: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
    hidden: ['credentials', 'deletedAt', 'createdAt', 'updatedAt'],
    credentials: function () {
      return this.hasOne(Teacher);
    }
  }, {
    schema: [
      fields.StringField('phone'),
      fields.BooleanField('active'),
      fields.IntField('credentials'),
      fields.StringField('lastname', { maxLength: 32 }),
      fields.StringField('accountLevel', { required: true }),
      fields.EmailField('email', { required: true, maxLength: 64 }),
      fields.StringField('name', { required: true, maxLength: 32 })
    ]
  });

  Store.add('Models.Cards.Teacher', Model);
};
