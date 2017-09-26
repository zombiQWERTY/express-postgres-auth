import R from 'ramda';

const render = ({ res, type, status, json }) => {
  if (type === 'status') {
    return res.sendStatus(status);
  } else {
    return res.status(status).send(json);
  }
};

export const setResponse = (req, res) => payload => {
  if (payload instanceof Error) {
    const type = 'json';
    const status = 200;
    const success = false;

    const json = { payload: R.omit(['type'], payload), success };
    return render({ res, type, status, json });
  } else {
    const type = payload.type || 'json';
    const status = payload.status || 200;
    const success = R.pathOr(true, ['success'], payload);

    const json = { payload: R.omit(['type', 'status', 'success'], payload), success };
    return render({ res, type, status, json });
  }
};
