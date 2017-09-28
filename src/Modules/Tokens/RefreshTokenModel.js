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
    tableName: 'refreshTokens',
    softDelete: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
    student_id: function () {
      return this.hasOne(Student);
    }
  }, {
    schema: [
      fields.BooleanField('active'),
      fields.IntField('student_id', { required: true }),
      fields.DateField('expiresIn', { required: true }),
      fields.StringField('clientId', { required: true }),
      fields.StringField('refreshToken', { required: true })
    ]
  });

  Store.add('Models.Token.Refresh', Model);
};
