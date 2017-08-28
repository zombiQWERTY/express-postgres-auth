import R from 'ramda';

const render = (res, json) => {
  const renderStatus = () => res.sendStatus(json.status);
  const renderJSON = () => res.status(json.status).send(R.omit(['status', 'type'], json));

  switch (json.type) {
    case 'status':
      return renderStatus();

    default:
      return renderJSON();
  }
};

const success = (req, res) => (params = {}) =>
  render(res, R.merge({
    status: 200,
    type: 'json',
    payload: {}
  }, params));

const fail = (req, res) => (params = {}) =>
  render(res, R.merge({
    status: 500,
    type: 'json'
  }, params));

export const setRes = (req, res) => ({
  success: success(req, res),
  fail: fail(req, res)
});
