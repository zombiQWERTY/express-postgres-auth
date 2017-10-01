import { node } from 'fluture';
import { Store } from '../../Start/ConnectionsStore';

const validateInterval = (teacher, dayOfWeek, start, end) => {
  const TeacherAvailabilityModel = Store.get('Models.Timetable.TeacherAvailability');
  return node(done => TeacherAvailabilityModel
    .where(field, value).fetch({ withRelated: ['credentials'] }).asCallback(done));
};
