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

const isEndGTStart = (start, end) => start < end;
const is24Deal = value => value >= 0 && value < 24;
const isDayOfWeek = value => value > 0 && value <= 7;

const validateIntervalRules = () =>
  makeRules({
    teacher: ['required', 'integer'],
    start: ['required', 'integer', 'greaterThan:0', 'lessThan:24'],
    end: ['required', 'integer', 'greaterThan:0', 'lessThan:24'],
    dayOfWeek: ['required', 'integer', 'greaterThan:0', 'lessThan:8']
  });

const validateIntervalData = runValidator(validateIntervalRules());
const validateInterval = ({ start, end, dayOfWeek, teacher }) =>
  isEndGTStart(start, end) && is24Deal(start) && is24Deal(end) && isDayOfWeek(dayOfWeek)
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

export const insertAvailableTime = ({ teacher, dayOfWeek, start, end }) =>
  validateIntervalData({ teacher, dayOfWeek, start, end })
    .map(R.map(parseInt(R.__, 10)))
    .chain(validateInterval)
    .chain(validateIntervalUniqueness)
    .chain(data => makeCb(knex('teacherAvailability').insert, data))
    .map(() => {});

export const getTimetable = ({ language, level, lessonsType }) =>
  Future
    .do(function * () {
      const cards = yield getTeachersByLanguageLevelLessonsType({ language, level, lessonsType });

      return { cards };
    });
