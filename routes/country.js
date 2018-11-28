import express from 'express';
import Ref from '../models/country';

const router = express.Router();

router.get('/', function(req, res) {
  console.log('>>>>Retrieve all country items');
  Ref.getAllCountry()
    .then((result) => {
      console.log('>>>>Retrieved all country items', result);
      res.send(result);
    })
});

router.get('/:countryId', function(req, res) {
  const countryId = req.params.countryId;
  console.log('>>>>Retrieve country by countryId', countryId);
  Ref.getCountry(countryId)
    .then((result) => {
      console.log('>>>>Retrieved country item', result);
      res.send(result);
    })
});

router.put('/', function(req, res) {
  const country = req.body;
  console.log('>>>>Insert country item', country);

  Ref.addCountry(country)
    .then(([result]) => {
      console.log('>>>>Inserted country item', result);
      res.send(result);
    })
});

router.post('/', function(req, res) {
  const country = req.body;
  console.log('>>>>Update country item', country);

  Ref.setCountry(country)
    .then(([result]) => {
      console.log('>>>>Updated country item', result);
      res.send(result);
    });
});

router.delete('/', function(req, res) {
  const country = req.body;
  console.log('>>>>Delete country item', country);

  Ref.delCountry(country.id)
    .then(() => {
      console.log('>>>>Deleted country item', country);
      res.send('ok');
    })
});

export default router;
