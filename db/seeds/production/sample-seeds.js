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
  Promise.all([])
    .then(() => {
      knex('country').insert(COUNTRY, 'id').then((ids) => {console.log('>>>>Print Country IDs', ids);});
      knex('city').insert(CITY, 'id').then((ids) => {console.log('>>>>Print Country IDs', ids);});
      //knex('hotel').insert();
      //knex('hotel_image').insert();
      knex('attraction').insert(ATTRACTION, 'id').then((ids) => {console.log('>>>>Print Attraction IDs', ids);});
      knex('attraction_image').insert(ATTRACTION_IMAGE, 'id').then((ids) => {console.log('>>>>Print Attraction Image IDs', ids);});
      knex('package').insert(PACKAGE, 'id').then((ids) => {console.log('>>>>Print Package IDs', ids);});
      knex('package_item').insert(PACKAGE_ITEM, 'id').then((ids) => {console.log('>>>>Print Package Item IDs', ids);});
      knex('package_image').insert(PACKAGE_IMAGE, 'id').then((ids) => {console.log('>>>>Print Package Image IDs', ids);});
      //knex('package_depart_date').insert();
      //knex('package_rate').insert();
      //knex('car_rate').insert();
      //knex('flight_rate').insert();
    });
