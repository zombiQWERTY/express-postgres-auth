import Warlock from 'node-redis-warlock';

export const createWarlock = Redis => new Warlock(Redis);

export const executeOnce = (warlock, key, done) => {
  warlock.lock(key, 20000, (err, unlock) => {
    if (err) { return; }

    if (typeof unlock === 'function') {
      setTimeout(() => done(unlock), 1000);
    }
  });
};
