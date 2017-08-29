import express from 'express';

import info from './Session/info';
import create from './Session/create';
// import remove from './Session/remove';

const router = express.Router();

export default app => {
    router
        .get('/', info)
        .put('/', create)
        // .delete('/', remove);

    app.use(`/api/session`, router);
};
