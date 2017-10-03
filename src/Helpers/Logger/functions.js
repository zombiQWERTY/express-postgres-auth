import winston from 'winston';
import Sentry from 'winston-sentry';
import config from '../../../config/config.json';
import { levels } from './consts';
import { isProduction, NODE_ENV } from '../ENV/NODE_ENV';

export const createLogger = () => {
  winston.loggers.add('generic', {
    console: {
      colorize: true,
      level: levels[NODE_ENV].generic.console
    },
    file: {
      json: true,
      timestamp: true,
      filename: './log/generic.log',
      level: levels[NODE_ENV].generic.file
    },
    transports: [
      new Sentry({
        dsn: config.sentry.dsn,
        patchGlobal: isProduction(),
        level: levels[NODE_ENV].generic.sentry
      })
    ]
  });
};

export const genericLogger = winston.loggers.get('generic');
