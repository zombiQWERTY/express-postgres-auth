import R from 'ramda';

class Store {
  static instances = {};

  static add(name, connection) {
    const path = R.split('.', name);
    const lensPath = R.lensPath(path);
    const instance = R.view(lensPath, this.instances);
    if (instance) {
      return instance;
    } else {
      this.instances = R.assocPath(path, connection, this.instances);
      return connection;
    }
  }

  static get(name) {
    const path = R.compose(R.lensPath, R.split('.'));
    return R.view(path(name), this.instances);
  }
}

export { Store };
