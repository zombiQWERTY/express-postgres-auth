module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      user: 'iqlang',
      password: 'iqlang',
      database: 'iqlang'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      stub: './migrations/template'
    }
  },
  test: {
    client: 'postgresql',
    connection: {
      user: 'your_database_user',
      password: 'your_database_password',
      database: 'myapp_test'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      stub: './migrations/template'
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      user: 'your_database_user',
      password: 'your_database_password',
      database: 'myapp_test'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      stub: './migrations/template'
    }
  }
};
