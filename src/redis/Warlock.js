import WarlockRedis from 'node-redis-warlock';

let Warlock = null;
export const createWarlock = redis => {
  Warlock = new WarlockRedis(redis);
};

export const executeOnce = (key, done) => {
  Warlock.lock(key, 20000, (err, unlock) => {
    if (err) { return; }

    if (typeof unlock === 'function') {
      setTimeout(() => done(unlock), 1000);
    }
  });
};

export { Warlock };
