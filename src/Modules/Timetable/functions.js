import Future, { node } from 'fluture';
import { Store } from '../../Start/ConnectionsStore';
import { ValidationError } from '../../utils/errors';

const validateInterval = (start, end) =>
  start < end ? Future.of(true) : Future.reject(new ValidationError({
    interval: ['Invalid interval.']
  }));

const validateIntervalUniqueness = (Model, teacher, dayOfWeek, start, end) =>
  node(done =>
    Model
      .query(qb => qb
        .where({ teacher, dayOfWeek })
        .andWhere('end', '>=', start)
        .andWhere('start', '<=', end)) // TODO: develop a query
    .fetch()
    .asCallback(done))
    .chain(entry => {
      const error = new ValidationError({
        interval: ['Entity with this day and time interval already exists.']
      });

      return entry ? Future.reject(error) : Future.of(true);
    });

export const insertAvailableTime = ({ teacher, dayOfWeek, start, end }) => {
  const TeacherAvailabilityModel = Store.get('Models.Timetable.TeacherAvailability');

  return validateInterval(start, end)
    .chain(() => validateIntervalUniqueness(TeacherAvailabilityModel, teacher, dayOfWeek, start, end))
    .chain(() => node(done =>
      new TeacherAvailabilityModel({ teacher, dayOfWeek, start, end }).save().asCallback(done)))
    .map(entity => entity.toJSON());
};
