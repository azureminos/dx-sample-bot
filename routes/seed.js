import knex  from '../db/knex';
import express from 'express';
import {COUNTRY, CITY, ATTRACTION, ATTRACTION_IMAGE, PACKAGE,
  PACKAGE_IMAGE, PACKAGE_ITEM, HOTEL, HOTEL_IMAGE,
  PACKAGE_RATE, CAR_RATE, FLIGHT_RATE}
  from '../db/seeds/sample-seed-helpers';

const router = express.Router();

router.get('/', function(req, res) {
  console.log('>>>>Seeding');
  knex('country')
  .insert(COUNTRY, 'id')
  .then((ids) => {
    console.log('>>>>Country IDs', ids);
    knex('city')
      .insert(CITY, 'id')
      .then((ids) => {
        console.log('>>>>City IDs', ids);
        Promise.all([
          knex('attraction')
          .insert(ATTRACTION, 'id')
          .then((ids) => {
            console.log('>>>>Attraction IDs', ids);
            knex('attraction_image')
              .insert(ATTRACTION_IMAGE, 'id')
              .then((ids) => {
                console.log('>>>>Attraction Image IDs', ids);
              });
          }),
          knex('hotel')
          .insert(HOTEL, 'id')
          .then((ids) => {
            console.log('>>>>Hotel IDs', ids);
            knex('hotel_image')
              .insert(HOTEL_IMAGE, 'id')
              .then((ids) => {
                console.log('>>>>Hotel Image IDs', ids);
              });
          }),
        ])
        .then(() => {
          knex('package')
          .insert(PACKAGE, 'id')
          .then((ids) => {
            console.log('>>>>Package IDs', ids);
            Promise.all([
              knex('package_item')
              .insert(PACKAGE_ITEM, 'id')
              .then((ids) => console.log('>>>>Package Item IDs', ids)),
              knex('package_image')
              .insert(PACKAGE_IMAGE, 'id')
              .then((ids) => console.log('>>>>Package Image IDs', ids)),
              knex('package_rate')
              .insert(PACKAGE_RATE, 'id')
              .then((ids) => console.log('>>>>Package Rate IDs', ids)),
              knex('car_rate')
              .insert(CAR_RATE, 'id')
              .then((ids) => console.log('>>>>Package Car Rate IDs', ids)),
              knex('flight_rate')
              .insert(FLIGHT_RATE, 'id')
              .then((ids) => console.log('>>>>Package Flight Rate IDs', ids)),
            ]);
          });
        });
      });
  });
  res.send('ok');
});

export default router;
