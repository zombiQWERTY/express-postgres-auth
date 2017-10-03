import R from 'ramda';
import IORedis from 'ioredis';
import { fromEvent } from 'most';
import { genericLogger } from '../Helpers/Logger/functions';
import { isProduction } from '../Helpers/ENV/NODE_ENV';
import { Store } from '../Modules/Store/Store';

export const handleRedisEvents = Redis => {
  fromEvent('error', Redis)
    .observe(error => genericLogger.verbose(`Redis error.`, error));

  fromEvent('close', Redis)
    .observe(() => genericLogger.verbose(`Redis connection lost.`));

  fromEvent('reconnecting', Redis)
    .observe(() => genericLogger.verbose(`Reconnecting to redis...`));

  fromEvent('ready', Redis)
    .observe(() => genericLogger.verbose(`Redis connection established.`));

  fromEvent('connect', Redis)
    .observe(() => genericLogger.verbose(`Redis connected.`));

  fromEvent('end', Redis)
    .observe(() => genericLogger.verbose(`Redis connection lost. Reconnecting...`));
};

export const createRedisConnection = () => {
  const { config } = Store.get('config');

  return new IORedis(R.merge(config.redis, {
    showFriendlyErrorStack: !isProduction(),
    retryStrategy(times) {
      return Math.min(times * 50, 2000);
    },
    reconnectOnError(error) {
      return error.message.includes('READONLY');
    }
  }));
};
