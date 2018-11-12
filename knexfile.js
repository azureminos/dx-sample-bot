/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// eslint-disable-next-line
module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost/list_bot_test',
    migrations: {
      directory: `${__dirname}/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/db/seeds/test`,
    },
  },
  development: {
    client: 'pg',
    connection: 'postgres://qobnyzboaiiwyg:a17ca8f391b99fab31c6a5d73e17ed775d92f3e135a1e01a69a66c70fb2dcdc1@ec2-54-235-94-36.compute-1.amazonaws.com:5432/datq5kquk52697?ssl=true',
    migrations: {
      directory: `${__dirname}/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/db/seeds/development`,
    },
  },
  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    migrations: {
      directory: `${__dirname}/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/db/seeds/production`,
    },
  },
};
