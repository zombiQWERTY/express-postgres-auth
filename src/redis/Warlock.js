import WarlockRedis from 'node-redis-warlock';
import { Store } from '../Modules/Store/Store';

export const createWarlock = redis => new WarlockRedis(redis);

export const executeOnce = (key, done) => {
  const Warlock = Store.get('Warlock');

  Warlock.lock(key, 20000, (err, unlock) => {
    if (err) { return; }

    if (typeof unlock === 'function') {
      setTimeout(() => done(unlock), 1000);
    }
  });
};

export { Warlock };
