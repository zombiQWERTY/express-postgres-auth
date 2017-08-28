import express from 'express';

import { needsGroup, forAnon, ADMIN } from '../auth/index';
import { authLocal } from '../auth/auth';

import info from './Session/info';
import create from './Session/create';
import remove from './Session/remove';

const router = express.Router();

export default app => {
    router
        .get('/', needsGroup([ADMIN]), info)
        .put('/', forAnon(), authLocal, create)
        .delete('/', needsGroup([ADMIN]), remove);

    app.use(`/api/session`, router);
};
