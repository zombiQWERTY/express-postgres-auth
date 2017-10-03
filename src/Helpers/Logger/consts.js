/**
 * error:   0
 * warn:    1
 * info:    2
 * verbose: 3
 * debug:   4
 * silly:   5
 */

export const levels = {
  production: {
    generic: {
      console: -1,
      file: 'info',
      sentry: 'warn'
    }
  },
  development: {
    generic: {
      sentry: -1,
      file: 'info',
      console: 'silly'
    }
  },
  test: {
    generic: {
      file: -1,
      sentry: -1,
      console: -1,
    }
  }
};
