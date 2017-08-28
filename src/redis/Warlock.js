import Redis from 'redis';
import Warlock from 'node-redis-warlock';

const warlock = new Warlock(Redis.createClient());

export function executeOnce(key, callback) {
  warlock.lock(key, 20000, function(err, unlock) {
    if (err) {
      return;
    }

    if (typeof unlock === 'function') {
      setTimeout(function() {
        callback(unlock);
      }, 1000);
    }
  });
}
