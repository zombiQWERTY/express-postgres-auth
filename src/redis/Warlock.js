import WarlockRedis from 'node-redis-warlock';

let Warlock = null;
export const createWarlock = Redis => {
  Warlock = new WarlockRedis(Redis);
  return Warlock;
};

export { Warlock };

export const executeOnce = (key, done) => {
  Warlock.lock(key, 20000, (err, unlock) => {
    if (err) { return; }

    if (typeof unlock === 'function') {
      setTimeout(() => done(unlock), 1000);
    }
  });
};
