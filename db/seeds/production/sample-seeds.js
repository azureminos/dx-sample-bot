/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {COUNTRY, CITY, ATTRACTION, ATTRACTION_IMAGE, PACKAGE, PACKAGE_IMAGE, PACKAGE_ITEM} =
  require('../sample-seed-helpers');

/**
 * Dev ENV Seed File - When run with `knex seed:run`,
 * populates database with placeholder data.
 * @param {string} knex - Knex dependency
 * @param {Promise} Promise - Promise dependency
 * @returns {Promise} A single Promise that resolves when
 * user and list items have been inserted into the database.
 */
exports.seed = (knex, Promise) =>
  Promise.all([
    knex('country').insert(COUNTRY, 'id'),
    //knex('city').insert(CITY, 'id'),
    // knex('hotel').insert(),
    // knex('hotel_image').insert()
    //knex('attraction').insert(ATTRACTION, 'id'),
    //knex('attraction_image').insert(ATTRACTION_IMAGE, 'id'),
    //knex('package').insert(PACKAGE, 'id'),
    //knex('package_item').insert(PACKAGE_ITEM, 'id'),
    //knex('package_image').insert(PACKAGE_IMAGE, 'id'),
    // knex('package_depart_date').insert(),
    // knex('package_rate').insert(),
    // knex('car_rate').insert(),
    // knex('flight_rate').insert(),
  ])
  .then((ids) => {
    for (let i = 0; i < ids.length; i++) {
      console.log('>>>>Pring IDs', ids[i]);
    }
  });
