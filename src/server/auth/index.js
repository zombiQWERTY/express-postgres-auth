import compose from 'compose-middleware';
import auth from './auth';
import ROLES from '../enums/role';

export function needsGroup(group = [ROLES.USER]) {
    return compose.compose([
        auth,
        async function(req, res, next) {
            if (!req.user) {
                return res.setRes.fail({
                    status:  401,
                    message: 'Unauthorized.'
                });
            }

            if (!group.includes(ROLES.ADMIN)) { group = [...group, ROLES.ADMIN]; }
            if (!group.includes(req.user.role)) {
                return res.setRes.fail({
                    status:  403,
                    message: 'Access denied.'
                });
            }

            await next();
        }
    ]);
}

export function forAnon() {
    return compose.compose([
        auth,
        async function(req, res, next) {
            if (req.user) {
                return res.setRes.fail({
                    message:  'Restricted for authorized users.',
                    status:   401
                });
            }
            await next();
        }
    ]);
}

export const { USER, ADMIN } = ROLES;
