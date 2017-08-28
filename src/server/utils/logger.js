import winston from 'winston';
import Sentry from 'winston-sentry';
import config from '../../../config/config.json';

import { isProduction, NODE_ENV } from './NODE_ENV';

/**
 * error:   0
 * warn:    1
 * info:    2
 * verbose: 3
 * debug:   4
 * silly:   5
 */

const levels = {
  production: {
    generic: {
      console: -1,
      file: 'info',
      sentry: 'warn'
    },
    memory: {
      console: -1,
      file: 'info',
      sentry: 'warn'
    }
  },
  development: {
    generic: {
      console: 'silly',
      file: 'info',
      sentry: -1
    },
    memory: {
      console: 'warn',
      file: 'info',
      sentry: -1
    }
  },
  test: {
    generic: {
      console: -1,
      file: -1,
      sentry: -1
    },
    memory: {
      console: -1,
      file: -1,
      sentry: -1
    }
  }
};

export const createLogger = () => {
  winston.loggers.add('generic', {
    console: {
      colorize: true,
      level: levels[NODE_ENV].generic.console
    },
    file: {
      json: true,
      timestamp: true,
      level: levels[NODE_ENV].generic.file,
      filename: './log/generic.log'
    },
    transports: [
      new Sentry({
        dsn: config.sentry,
        patchGlobal: isProduction(),
        level: levels[NODE_ENV].generic.sentry
      })
    ]
  });
};

export const genericLogger = winston.loggers.get('generic');
