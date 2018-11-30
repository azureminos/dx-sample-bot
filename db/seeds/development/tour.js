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
exports.seed = (knex, Promise) => {
  knex('country')
    .insert(COUNTRY, 'id')
    .then((ids) => {
      console.log('Country IDs', ids);
      knex('city')
        .insert(CITY, 'id')
        .then((ids) => {
          console.log('City IDs', ids);
          knex('attraction')
            .insert(ATTRACTION, 'id')
            .then((ids) => {
              console.log('Attraction IDs', ids);
              knex('attraction_image')
                .insert(ATTRACTION_IMAGE, 'id')
                .then((ids) => {
                  console.log('Attraction Image IDs', ids);
                  knex('package')
                    .insert(PACKAGE, 'id')
                    .then((ids) => {
                      console.log('Package IDs', ids);
                      knex('package_item')
                        .insert(PACKAGE_ITEM, 'id')
                        .then((ids) => {
                          console.log('Package Item IDs', ids);
                          knex('package_image')
                            .insert(PACKAGE_IMAGE, 'id')
                            .then((ids) => console.log('Package IMage IDs', ids));
                        });
                    });
                });
            });
        });
    });
}
