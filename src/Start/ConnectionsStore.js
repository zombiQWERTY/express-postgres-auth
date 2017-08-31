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
      this.instances = R.assocPath(path, connection, Store.instances);
      return connection;
    }
  }

  static get(name) {
    const path = R.split('.', name);
    const lensPath = R.lensPath(path);
    return R.view(lensPath, this.instances);
  }
}

export { Store };
