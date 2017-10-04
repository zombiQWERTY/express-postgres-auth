import R from 'ramda';
import Future from 'fluture';
import Checkit from 'checkit';

export const runValidator = R.curry((rules, data) => Future.tryP(() => rules.run(data)));
export const makeRules = rules =>  new Checkit(rules);
