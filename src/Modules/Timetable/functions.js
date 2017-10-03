import Future, { node } from 'fluture';
import { Store } from '../Store/Store';
import { ValidationError } from '../../Helpers/Errors/classes';

const validateInterval = (start, end) =>
  start < end ? Future.of(true) : Future.reject(new ValidationError({
    interval: ['Invalid interval.']
  }));

const validateIntervalUniqueness = (Model, teacher, dayOfWeek, start, end) =>
  node(done =>
    Model
      .query(qb => function () {
        const query = `
          "teacher"   = :teacher   AND 
          "dayOfWeek" = :dayOfWeek AND 
          (
            "start" < :end OR 
            "end" > :start OR
            (
              "start" > :start AND
              "end" < :end
            )
          )
        `;

        this.whereRaw(query, { teacher, dayOfWeek, start, end });
      })
    .fetch()
    .asCallback(done))
    .chain(entry => {
      console.log(entry);
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
