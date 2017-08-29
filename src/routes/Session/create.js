import info from './info';

/**
 * @api {put} /api/session Create session
 * @apiName SessionCreate
 * @apiGroup Session
 *
 * @apiParam {String} email User email
 * @apiParam {String} password User password

 * @apiSuccess {Object} user Full user info
 * @apiError 401 Unauthorized
 */
export default info;
