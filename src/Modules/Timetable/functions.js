import R from 'ramda';
import Future from 'fluture';
import { knex, makeCb } from '../../db/index';
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
    .where('teacher', 'in', teachers)
    .select('teacherAvailability.start',
      'teacherAvailability.end',
      'teacherAvailability.dayOfWeek',
      'teacherAvailability.teacher'));
// TODO: выбирать только те интервалы, в которых нет уроков

export const insertAvailableTime = ({ teacher, dayOfWeek, start, end }) =>
  validateIntervalData({ teacher, dayOfWeek, start, end })
    .map(R.map(toInt))
    .chain(validateInterval)
    .chain(validateIntervalUniqueness)
    .chain(data => makeCb(knex('teacherAvailability').insert(data)))
    .map(() => {});

export const getTimetable = ({ language, level, lessonsType }) =>
  Future
    .do(function * () {
      const cards = yield getTeachersByLanguageLevelLessonsType({ language, level, lessonsType });

      if (cards.length) {
        const intervals = yield getIntervalsForTeachers(R.map(R.prop('id'), cards));
        return { cards, intervals };
      } else {
        return { cards: [], intervals: [] };
      }
    });
