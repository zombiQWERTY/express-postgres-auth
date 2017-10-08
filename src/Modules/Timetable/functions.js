import R from 'ramda';
import Future from 'fluture';
import { knex, makeCb } from '../../db/index';
import { getBusyLesson } from '../Lessons/functions';
import { ValidationError } from '../../Helpers/Errors/classes';
import { makeRules, runValidator } from '../../Helpers/CheckIt/functions';
import { getTeachersByLanguageLevelLessonsType } from '../Cards/functions';

const validateIntervalUniquenessQuery = `
  "teacher"   = :teacher   AND 
  "dayOfWeek" = :dayOfWeek AND 
  (
    (:start = "start" AND :end = "end") OR 
    (:end = "start" AND :start = "end") OR 
    (:start <= "start" AND :end >= "end") OR 
    (:start >= "start" AND :end <= "end") 
  )
`;

const toInt = value => parseInt(value, 10);
const isInRange = (x, range) => x >= range[0] && x <= range[1];

const isValidRange = (start, end, range = [0, 23]) =>
  isInRange(start, range) && isInRange(end, range);

const validateIntervalRules = () =>
  makeRules({
    teacher: ['required', 'integer'],
    end: ['required', 'integer', 'greaterThan:0', 'lessThan:24'],
    start: ['required', 'integer', 'greaterThan:0', 'lessThan:24'],
    dayOfWeek: ['required', 'integer', 'greaterThan:0', 'lessThan:8']
  });

const validateIntervalData = runValidator(validateIntervalRules());
const validateInterval = ({ start, end, dayOfWeek, teacher }) =>
  start < end && isValidRange(start, end) && isInRange(dayOfWeek, [1, 7])
    ? Future.of({ start, end, dayOfWeek, teacher })
    : Future.reject(new ValidationError({
        interval: ['Invalid interval.']
      }));

const validateIntervalUniqueness = ({ teacher, dayOfWeek, start, end }) =>
  makeCb(knex('teacherAvailability')
    .whereRaw(validateIntervalUniquenessQuery, { teacher, dayOfWeek, start, end }))
    .chain(entries =>
      entries.length === 0
        ? Future.of({ teacher, dayOfWeek, start, end })
        : Future.reject(new ValidationError({
            interval: ['Entity with this day and time interval already exists.']
          })));

const getIntervalsForTeachers = teachers =>
  makeCb(knex('teacherAvailability')
    .whereIn('teacherAvailability.teacher', teachers)
    .select('teacherAvailability.start',
      'teacherAvailability.end',
      'teacherAvailability.dayOfWeek',
      'teacherAvailability.teacher')
    .whereNotExists(qb => qb.select('id').from('lessons')
      .whereIn('teacher', teachers).whereRaw(getBusyLesson)));

export const insertAvailableTime = ({ teacher, dayOfWeek, start, end }) =>
  validateIntervalData({ teacher, dayOfWeek, start, end })
    .map(R.map(toInt))
    .chain(validateInterval)
    .chain(validateIntervalUniqueness)
    .chain(data => makeCb(knex('teacherAvailability').insert(data)))
    .map(() => {});

const groupByProp = R.o(R.groupBy, R.prop);
const normalizeCards = R.o(R.map(R.head), groupByProp('id'));

const updatePath = R.curry((p, fn, obj) => R.assocPath(p, fn(R.path(p, obj)), obj));
const getIntervalsAndNormalizeSignature = cardIDs =>
  getIntervalsForTeachers(cardIDs)
    .map(R.reduce((result, { teacher, start, end, dayOfWeek }) =>
      R.reduce((result, hour) =>
          updatePath([dayOfWeek, R.toString(hour)],
            R.append(teacher), result), result, R.range(start, end + 1)), {}));

export const getTimetable = ({ language, level, lessonsType }) =>
  Future
    .do(function * () {
      const cards = yield getTeachersByLanguageLevelLessonsType({ language, level, lessonsType });

      if (cards.length) {
        const intervals = yield getIntervalsAndNormalizeSignature(R.map(R.prop('id'), cards));
        return { cards: normalizeCards(cards), intervals };
      } else {
        return { cards: [], intervals: [] };
      }
    });
