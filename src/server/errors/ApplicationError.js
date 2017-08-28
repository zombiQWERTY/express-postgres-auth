import R from 'ramda';
import JSON from 'json3';
import Future from 'fluture';
import { genericLogger } from '../utils/logger';

class ApplicationError extends Error {
  constructor(message, params = {}) {
    super(message, params);

    const defaultParams = {
      status: 500,
      log: false
    };

    params = R.merge(params, {
      message,
      name: this.constructor.name
    });

    if (params.reason instanceof Error) {
      params = R.assoc('message', params.message + ' ' + params.reason.message, params);

      Future.encase(JSON.stringify, params.reason)
        .map(string => { params = R.assoc('reason', string, params); })
        .fork(error => genericLogger.error(this, error), R.identity);
    }

    Object.assign(this, defaultParams, params);
    Error.captureStackTrace(this, this.constructor);

    if (this.log) { genericLogger.error(this); }
  }
}

export default ApplicationError;
