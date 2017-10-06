import { getTeacherByLanguageLevelLessonsType } from '../../Modules/Cards/functions';

/**
 * @api {post} /api/timetable/teacher/find Find teachers by rules timetable
 * @apiName TeachersFind
 * @apiGroup Timetable
 *
 * @apiParam {Number} language Language id to filtering
 * @apiParam {Number} level Difficulty level of lesson (and teacher)
 * @apiParam {String="individual", "group", "all"} lessonsType Lessons type
 *
 * @apiVersion 1.0.0
 */

const v1_0_0 = (req, res, next) =>
  getTeacherByLanguageLevelLessonsType(req.body)
    .fork(next, res.setRes);

export const find = {
  '1.0.0': v1_0_0
};
