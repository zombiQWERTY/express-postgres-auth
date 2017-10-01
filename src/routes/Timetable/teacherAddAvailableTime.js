import { generateTokenPair } from '../../Modules/Tokens/functions';

/**
 * @api {put} /api/timetable/teacher/availability Add an entry to teacher's availability timetable
 * @apiName TeacherAddAvailableTime
 * @apiGroup Timetable
 *
 * @apiParam {Number} dayOfWeek Day of week in range 1...7
 * @apiParam {Number} start An hour that indicates start of interval (in 1...24 range)
 * @apiParam {Number} end An hour that indicates start of interval (in 1...24 range)
 *
 * @apiVersion 1.0.0
 */

const v1_0_0 = (req, res, next) =>
  generateTokenPair({ clientId: req.headers['x-request-id'], role: req.user.role, userId: req.user.id })
    .fork(next, res.setRes);
// write fn that validates an interval in db and another that saves an entity into db

export const add = {
  '1.0.0': v1_0_0
};
