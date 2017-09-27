import R from 'ramda';
import { genericLogger } from '../utils/logger';

const render = ({ res, type, status, json }) =>
  type === 'status' ? res.sendStatus(status) : res.status(status).send(json);

export const setResponse = (req, res) => payload => {
  if (payload instanceof Error) {
    genericLogger.error(payload);

    const type = 'json';
    const status = 200;
    const success = false;

    const json = { payload, success };
    return render({ res, type, status, json });
  } else {
    const type = R.pathOr('json', ['type'], payload);
    const status = R.pathOr(200, ['status'], payload);
    const success = R.pathOr(true, ['success'], payload);

    const json = { payload: R.omit(['status', 'success'], payload), success };
    return render({ res, type, status, json });
  }
};
