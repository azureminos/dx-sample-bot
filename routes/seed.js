import knex  from '../db/knex';
import express from 'express';
import {COUNTRY, CITY, ATTRACTION, ATTRACTION_IMAGE, PACKAGE, PACKAGE_IMAGE, PACKAGE_ITEM} from '../db/seeds/sample-seed-helpers';

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
        knex('attraction')
          .insert(ATTRACTION, 'id')
          .then((ids) => {
            console.log('>>>>Attraction IDs', ids);
            knex('attraction_image')
              .insert(ATTRACTION_IMAGE, 'id')
              .then((ids) => {
                console.log('>>>>Attraction Image IDs', ids);
                knex('package')
                  .insert(PACKAGE, 'id')
                  .then((ids) => {
                    console.log('>>>>Package IDs', ids);
                    knex('package_item')
                      .insert(PACKAGE_ITEM, 'id')
                      .then((ids) => {
                        console.log('>>>>Package Item IDs', ids);
                        knex('package_image')
                          .insert(PACKAGE_IMAGE, 'id')
                          .then((ids) => console.log('>>>>Package IMage IDs', ids));
                      });
                  });
              });
          });
      });
  });
  res.send('ok');
});

export default router;