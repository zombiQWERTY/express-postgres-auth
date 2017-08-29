import R from 'ramda';
import IORedis from 'ioredis';
import { fromEvent } from 'most';
import { genericLogger } from '../utils/logger';
import { isProduction } from '../utils/NODE_ENV';

const handleRedisEvents = connection => {
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

let Redis = null;
export const createRedisConnection = config => {
  Redis = new IORedis(R.merge(config, {
    showFriendlyErrorStack: !isProduction(),
    retryStrategy(times) {
      return Math.min(times * 50, 2000);
    },
    reconnectOnError(error) {
      return error.message.includes('READONLY');
    }
  }));

  handleRedisEvents(Redis);
  return Redis;
};

export { Redis };
