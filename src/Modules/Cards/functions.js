import { knex, makeCb } from '../../db/index';
import { teacherAccountLevel } from '../Cards/consts';

const getTeachersByLessonsType = lessonsType =>
  knex('teachers')
    .where({ lessonsType, accountLevel: teacherAccountLevel[40].value })
    .select('teachers.id', 'teachers.firstName', 'teachers.familyName', 'teachers.fluentLanguage');

const checkIfTeacherHasTimetable = () =>
  knex()
    .select('id')
    .from('teacherAvailability')
    .whereRaw('teachers.id = "teacherAvailability".teacher');

export const getTeachersByLanguageLevelLessonsType = ({ language, level, lessonsType }) =>
  makeCb(getTeachersByLessonsType(lessonsType)
    .leftJoin('teacherLevelLanguageCEFRJunction', 'teachers.id', 'teacherLevelLanguageCEFRJunction.teacher')
    .where('teacherLevelLanguageCEFRJunction.difficultyLevel', level)
    .where('teacherLevelLanguageCEFRJunction.canTeach', true)

    .leftJoin('teacherLanguageCEFRJunction', 'teacherLanguageCEFRJunction.id', 'teacherLevelLanguageCEFRJunction.languageCEFR')
    .where('teacherLanguageCEFRJunction.language', language)
    .whereExists(checkIfTeacherHasTimetable()));
  // TODO: add rating, avatar
