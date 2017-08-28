import winston from 'winston';
import fs from 'fs';
import Sentry from 'winston-sentry';
import cfg from '../../../config/sentry.json';

import NODE_ENV from './NODE_ENV';

const dir = 'log';

/**
 * error:   0
 * warn:    1
 * info:    2
 * verbose: 3
 * debug:   4
 * silly:   5
 */

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

let levels = { generic: {}, memory: {} };

switch (NODE_ENV) {
  case 'production':
    levels.generic.console = -1;
    levels.generic.file = 'info';
    levels.generic.sentry = 'warn';

    levels.memory.console = -1;
    levels.memory.file = 'info';
    levels.memory.sentry = 'warn';
    break;

  case 'development':
    levels.generic.console = 'silly';
    levels.generic.file = 'info';
    levels.generic.sentry = -1;

    levels.memory.console = 'warn';
    levels.memory.file = 'info';
    levels.memory.sentry = -1;
    break;

  default:
    levels.generic.console = -1;
    levels.generic.file = -1;
    levels.generic.sentry = -1;

    levels.memory.console = -1;
    levels.memory.file = -1;
    levels.memory.sentry = -1;
    break;
}

winston.loggers.add('generic', {
  console: {
    level: levels.generic.console,
    colorize: true
  },
  file: {
    level: levels.generic.file,
    timestamp: true,
    json: true,
    filename: `${dir}/generic.log`
  },
  transports: [
    new Sentry({
      patchGlobal: NODE_ENV === 'production',
      level: levels.generic.sentry,
      dsn: cfg.dsn
    })
  ]
});

winston.loggers.add('memory', {
  console: {
    level: levels.memory.console,
    colorize: true,
    label: 'memory'
  },
  file: {
    level: levels.memory.file,
    timestamp: true,
    json: true,
    filename: `${dir}/memory.log`
  },
  transports: [
    new Sentry({
      patchGlobal: NODE_ENV === 'production',
      level: levels.memory.sentry,
      dsn: cfg.dsn
    })
  ]
});

export default winston;

export const genericLogger = winston.loggers.get('generic');
