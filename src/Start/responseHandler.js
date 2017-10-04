import R from 'ramda';
import { genericLogger } from '../Helpers/Logger/functions';
import { manipulateErrorData } from '../Helpers/Errors/classes';

const isError = payload => payload instanceof Error;

export const setResponse = (req, res) => payload => {
  const status = R.pathOr(200, ['status'], payload);

  if (isError(payload)) {
    genericLogger.error(payload);
    const errorData = manipulateErrorData(R.omit(['status', 'success'], payload));
    return res
      .status(status)
      .send({ payload: R.omit(['status', 'success'], errorData), success: false });
  } else {
    return res
      .status(status)
      .send({ payload: R.omit(['status', 'success'], payload), success: true });
  }
};
