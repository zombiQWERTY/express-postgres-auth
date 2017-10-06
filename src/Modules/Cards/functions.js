import R from 'ramda';
import moment from 'moment';
import Future from 'fluture';
import { knex, makeCb } from '../../db/index';

export const getTeacherByLanguageLevelLessonsType = ({ language, level, lessonsType }) => {
  const teacherLevelLanguageCEFR = 'teacherLanguageCEFRJunction';
  const teacherLevelLanguage = 'teacherLevelLanguageCEFRJunction';
  const query = knex('teachers')
    .where({ lessonsType })
    .leftJoin(teacherLevelLanguage, 'teachers.id', `${teacherLevelLanguage}.teacher`)
    .leftJoin(teacherLevelLanguageCEFR, `${teacherLevelLanguageCEFR}.id`, `${teacherLevelLanguage}.languageCEFR`)
    .where(`${teacherLevelLanguage}.difficultyLevel`, level)
    .where(`${teacherLevelLanguageCEFR}.language`, language);

  return makeCb(query)
    .map(s => {
      console.log(s);
      return s;
    });
};

