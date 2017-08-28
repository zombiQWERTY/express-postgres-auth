import R from 'ramda';
import importDir from 'import-dir';

import ApplicationError from '../errors/ApplicationError';
import ResponseManager from '../manager/ResponseManager';
import getRequestUri from '../utils/getRequestUri';
import NODE_ENV from '../utils/NODE_ENV';

export default app => {
    const routes = [
        importDir('../routes')
    ];

    app.use(async (req, res, next) => {
        res.setRes = new ResponseManager(req, res, {});
        next();
    });

    R.forEach(
        section => R.compose(R.forEach(name => section[name](app)), R.keys)(section),
        routes
    );

    app.use((req, res, next) => {
        if (NODE_ENV === 'production') {
            const error = new ApplicationError('Not Found', {
                detail: 'Unknown route.',
                extendedInfo: `Request url: ${getRequestUri(req)}`,
                status: 404
            });

            return next(error);
        }

        next();
    });

    app.use((error, req, res, next) => {
        res.setRes.fail({
            message: error.message,
            status: error.status || 500,
            errors: error.type || (error.detail || [])
        });
    });
};
