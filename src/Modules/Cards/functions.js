import { knex, makeCb } from '../../db/index';
import { teacherAccountLevel } from '../Cards/consts';

export const getTeacherByLanguageLevelLessonsType = ({ language, level, lessonsType }) => {
  const teacherLevelLanguageCEFR = 'teacherLanguageCEFRJunction';
  const teacherLevelLanguage = 'teacherLevelLanguageCEFRJunction';

  const query = knex('teachers')
    .where({ lessonsType, accountLevel: teacherAccountLevel[40].value })
    .select('teachers.id', 'teachers.firstName', 'teachers.familyName', 'teachers.fluentLanguage')

    .leftJoin(teacherLevelLanguage, 'teachers.id', `${teacherLevelLanguage}.teacher`)
    .where(`${teacherLevelLanguage}.difficultyLevel`, level)
    .where(`${teacherLevelLanguage}.canTeach`, true)

    .leftJoin(teacherLevelLanguageCEFR, `${teacherLevelLanguageCEFR}.id`, `${teacherLevelLanguage}.languageCEFR`)
    .where(`${teacherLevelLanguageCEFR}.language`, language);

  // TODO: add rating, avatar
  // TODO: выбирать только те интервалы, в которых нет уроков

  return makeCb(query)
    .map(s => {
      console.log(s);
      return s;
    });
};

