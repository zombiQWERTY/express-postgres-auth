import bookshelfMask from 'bookshelf-mask';
import bookshelfSchema from 'bookshelf-schema';
import fields from 'bookshelf-schema/lib/fields';
import bookshelfParanoia from 'bookshelf-paranoia';
import { Store } from '../../Start/ConnectionsStore';

export const createModel = () => {
  const DB = Store.get('db');
  const Student = Store.get('Model.Student');
  const Teacher = Store.get('Model.Teacher');
  const Language = Store.get('Model.Language');

  DB.plugin(bookshelfMask);
  DB.plugin('visibility');
  DB.plugin(bookshelfSchema());
  DB.plugin(bookshelfParanoia, { field: 'deletedAt', sentinel: 'active' });

  const Model = DB.Model.extend({
    tableName: 'lessons',
    softDelete: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
    hidden: ['deletedAt', 'createdAt', 'updatedAt'],
    student: function () {
      return this.hasMany(Student);
    },
    teacher: function () {
      return this.hasOne(Teacher);
    },
    language: function () {
      return this.hasOne(Language);
    }
  }, {
    schema: [
      fields.IntField('level', { required: true }),
      fields.IntField('teacher', { required: true }),
      fields.IntField('student', { required: true }),
      fields.StringField('type', { required: true }),
      fields.IntField('language', { required: true }),
      fields.StringField('status', { required: true }),
      fields.DateField('startTime', { required: true })
    ]
  });

  Store.add('Models.Lessons', Model);
};
