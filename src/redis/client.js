import Redis from 'ioredis';
import redisConfig from '../../config/redis.json';
import NODE_ENV from '../server/utils/NODE_ENV';
import { genericLogger } from '../server/utils/logger';

let redis;
function events(connection) {
    connection.on('error', error => {
        genericLogger.verbose(`Redis error. ${error.message}`);
    });

    connection.on('close', () => {
        genericLogger.verbose(`Redis connection lost.`);
    });

    connection.on('reconnecting', () => {
        genericLogger.verbose(`Reconnecting to redis...`);
    });

    connection.on('connect', () => {
        genericLogger.verbose(`Redis connected.`);
        redis = connection;
    });

    connection.on('ready', () => {
        genericLogger.verbose(`Redis connection established.`);
    });
}

function connect() {
    let connection = new Redis({
        port: redisConfig.port,
        host: redisConfig.host,
        showFriendlyErrorStack: NODE_ENV !== 'production',
        retryStrategy(times) {
            return Math.min(times * 50, 2000);
        }
    });

    events(connection);
    connection.on('end', () => {
        connection = connect();
    });
    return connection;
}

export default () => {
    redis = connect();
    return redis;
};

export { redis };
