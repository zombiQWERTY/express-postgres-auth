import bookshelfMask from 'bookshelf-mask';
import bookshelfSchema from 'bookshelf-schema';
import fields from 'bookshelf-schema/lib/fields';
import bookshelfParanoia from 'bookshelf-paranoia';
import { Store } from '../../Start/ConnectionsStore';

export const createModel = () => {
  const DB = Store.get('db');

  DB.plugin(bookshelfMask);
  DB.plugin('visibility');
  DB.plugin(bookshelfSchema());
  DB.plugin(bookshelfParanoia, { field: 'deletedAt', sentinel: 'active' });

  const Model = DB.Model.extend({
    tableName: 'teacherAvailability',
    softDelete: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
    hidden: ['deletedAt', 'createdAt', 'updatedAt']
  }, {
    schema: [
      fields.IntField('teacher', { required: true }),
      fields.IntField('dayOfWeek', { required: true }),
      fields.IntField('startInterval', { required: true }),
      fields.IntField('endInterval', { required: true })
    ]
  });

  Store.add('Models.Timetable.TeacherAvailability', Model);
};
