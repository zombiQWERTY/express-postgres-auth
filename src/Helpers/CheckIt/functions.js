import Future from 'fluture';
import Checkit from 'checkit';

export const runValidator = (rules, data) => Future.tryP(() => rules.run(data));
export const makeRules = rules =>  new Checkit(rules);
