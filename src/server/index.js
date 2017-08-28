import express from 'express';

import middleware from './middleware';
import serializers from './auth/serializers';
import strategies from './auth/strategies';

export default () => {
  const app = express();

  app.use(middleware(app));

  strategies();
  serializers();

  return app;
};
