import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import logger from 'express-log';
import qs from 'express-qs-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import compose from 'compose-middleware';

import corsConfig from './corsConfig';

export default () => {
    let middlewares = [
        compression(),
        helmet(),
        logger(),
        bodyParser.json({ limit: '50mb' }),
        bodyParser.urlencoded({ extended: false, limit: '50mb' }),
        cors(corsConfig),
        passport.initialize(),
        qs({})
    ];

    return compose.compose(middlewares);
};
