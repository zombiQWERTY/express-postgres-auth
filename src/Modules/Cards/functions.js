import { knex, makeCb } from '../../db/index';
import { teacherAccountLevel } from '../Cards/consts';

const teacherLevelLanguageCEFR = 'teacherLanguageCEFRJunction';
const teacherLevelLanguage = 'teacherLevelLanguageCEFRJunction';

export const getTeachersByLanguageLevelLessonsType = ({ language, level, lessonsType }) =>
  makeCb(knex('teachers')
    .where({ lessonsType, accountLevel: teacherAccountLevel[40].value })
    .select('teachers.id', 'teachers.firstName', 'teachers.familyName', 'teachers.fluentLanguage')

    .leftJoin(teacherLevelLanguage, 'teachers.id', `${teacherLevelLanguage}.teacher`)
    .where(`${teacherLevelLanguage}.difficultyLevel`, level)
    .where(`${teacherLevelLanguage}.canTeach`, true)

    .leftJoin(teacherLevelLanguageCEFR, `${teacherLevelLanguageCEFR}.id`, `${teacherLevelLanguage}.languageCEFR`)
    .where(`${teacherLevelLanguageCEFR}.language`, language));

  // TODO: Выбирать тех учителей, у которых есть хотя бы один интервал
  // TODO: add rating, avatar
