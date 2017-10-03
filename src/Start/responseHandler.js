import R from 'ramda';
import { genericLogger } from '../utils/logger';
import { manipulateErrorData } from '../Helpers/Errors/classes';

export const setResponse = (req, res) => payload => {
  if (payload instanceof Error || payload.success === false) {
    genericLogger.error(payload);

    const errorData = manipulateErrorData(R.omit(['status', 'success'], payload));
    const json = { payload: R.omit(['status', 'success'], errorData), success: false };
    return res.status(payload.status || 200).send(json);
  } else {
    const json = { payload: R.omit(['status', 'success'], payload), success: true };
    return res.status(payload.status || 200).send(json);
  }
};
