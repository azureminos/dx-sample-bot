/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {getReferences, getTours, getTourDetails, CITIES, ATTRACTIONS, TOURS, TOUR_DETAILS} =
  require('../sample-seed-helpers');

var map = {
  tour: {},
  attraction: {}
};
/**
 * Test ENV Seed File - When run with `knex seed:run`,
 * populates database with placeholder data.
 * @param {string} knex - Knex dependency
 * @param {Promise} Promise - Promise dependency
 * @returns {Promise} A single Promise that resolves when
 * user and list items have been inserted into the database.
 */
exports.seed = (knex, Promise) =>
  Promise.all([
    knex('tour_inst_user').del(),
    knex('tour_inst_items').del(),
    knex('tour_inst').del(),
    knex('tour_image').del(),
    knex('tour_details').del(),
    knex('reference').del(),
    knex('tour').del(),
  ]).then(() => {
    console.log('>>>>All Tour Data Deleted');
    return Promise.all([
      knex('reference').insert(getReferences(), ['id','value']),
      knex('tour').insert(getTours(), ['id','name'])
    ]).then(([items, tours]) => {
      console.log('>>>>All Items Data Inserted', items);
      for(var i=0; i<items.length; i++) {
        map.attraction[items[i].value] = items[i].id;
      }
      console.log('>>>>All Tour Data Inserted', tours);
      for(var i=0; i<tours.length; i++) {
        map.tour[tours[i].name] = tours[i].id;
      }
      console.log('>>>>Ref Map Generated', map);

      return knex('tour_details').insert(getTourDetails(map), 'id');
    }).then((ids) => {console.log('>>>>Inserted int tour_details', ids)});
  }




  );




/*
      knex('reference').insert(getReferences(), ['id','value']),
      knex('tour').insert(getTours(), ['id','name'])
      .then((refs) => {
        console.log('>>>>Inserted into reference table', refs);
        for(var i=0; i<refs.length; i++) {
          ref.item[refs[i].value] = refs[i].id;
        }
      })

      .then((tours) => {
        console.log('>>>>Inserted into tour table', tours);
        for(var i=0; i<tours.length; i++) {
          ref.tour[tours[i].name] = tours[i].id;
        }
      })
*/



   /*. knex('reference').insert(getReferences(), ['id','value'])

    }).then(() => {
      return knex('tour').insert(getTours,['id','name']);
    })
    then((dids) => {
      console.log('>>>>Inserted into tour_destination', dids);
      return knex('tour_activity').insert(getActivities(dids), 'id');
    })
    .then((aids) => {
      console.log('>>>>Inserted into tour_activity', aids);
      for(var i=0; i<aids.length; i++) {
        ref.activity[ACTIVITIES[i].name] = aids[i];
      }
      console.log('>>>>Populated ref.activity', ref.activity);
      return knex('tour').insert(TOURS, 'id');
    })
    .then((tids) => {
      console.log('>>>>Inserted into tour', tids);
      for(var i=0; i<tids.length; i++) {
        ref.tour[TOURS[i].name] = tids[i];
      }
      console.log('>>>>Populated ref.tour', ref.tour);
      return knex('tour_details').insert(getTourDetails(ref), 'id');
    })
    .then((tdids) => {
      console.log('>>>>Inserted into tour_details', tdids);
    })*/






