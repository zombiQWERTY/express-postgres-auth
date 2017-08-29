import R from 'ramda';
import Redis from 'ioredis';
import { fromEvent } from 'most';
import config from '../../config/config.json';
import { isProduction } from '../utils/NODE_ENV';
import { genericLogger } from '../utils/logger';

export const handleRedisEvents = connection => {
  fromEvent('error', connection)
    .observe(error => genericLogger.verbose(`Redis error.`, error));

  fromEvent('close', connection)
    .observe(() => genericLogger.verbose(`Redis connection lost.`));

  fromEvent('reconnecting', connection)
    .observe(() => genericLogger.verbose(`Reconnecting to redis...`));

  fromEvent('ready', connection)
    .observe(() => genericLogger.verbose(`Redis connection established.`));

  fromEvent('connect', connection)
    .observe(() => genericLogger.verbose(`Redis connected.`));

  fromEvent('end', connection)
    .observe(() => genericLogger.verbose(`Redis connection lost. Reconnecting...`));
};

export const createRedisConnection = () =>
  new Redis(R.merge(config.redis, {
    showFriendlyErrorStack: !isProduction(),
    retryStrategy(times) {
      return Math.min(times * 50, 2000);
    },
    reconnectOnError(error) {
      return error.message.includes('READONLY');
    }
  }));
