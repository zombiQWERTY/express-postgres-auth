import { knex, makeCb } from '../../db/index';
import { getBusyLesson } from '../Lessons/functions';
import { teacherAccountLevel } from '../Cards/consts';

const getAvailableTeachers = 'teachers.id = "teacherAvailability".teacher';
const getBusyLessonQuery = `
  lessons.teacher = teachers.id AND
  ${getBusyLesson}
`;

const getTeachersByLessonsType = lessonsType =>
  knex('teachers')
    .where({ lessonsType, accountLevel: teacherAccountLevel[40].value })
    .select('teachers.id', 'teachers.firstName', 'teachers.familyName', 'teachers.fluentLanguage');

export const getTeachersByLanguageLevelLessonsType = ({ language, level, lessonsType }) =>
  makeCb(getTeachersByLessonsType(lessonsType)
    .leftJoin('teacherLevelLanguageCEFRJunction', 'teachers.id', 'teacherLevelLanguageCEFRJunction.teacher')
    .where('teacherLevelLanguageCEFRJunction.difficultyLevel', level)
    .where('teacherLevelLanguageCEFRJunction.canTeach', true)

    .leftJoin('teacherLanguageCEFRJunction', 'teacherLanguageCEFRJunction.id', 'teacherLevelLanguageCEFRJunction.languageCEFR')
    .where('teacherLanguageCEFRJunction.language', language)
    .whereExists(qb => qb.select('id').from('teacherAvailability').whereRaw(getAvailableTeachers))

    .leftJoin('teacherAvailability', 'teachers.id', 'teacherAvailability.teacher')
    .whereNotExists(qb => qb.select('id').from('lessons').whereRaw(getBusyLessonQuery)));
  // TODO: add rating, avatar
