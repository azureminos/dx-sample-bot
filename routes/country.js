import express from 'express';
import request from 'request';
import Ref from '../models/country';

const router = express.Router();

router.get('/', function(req, res) {
  console.log('>>>>Retrieve all country items');
  /*Ref.getAllCountry()
    .then((result) => {
      console.log('>>>>Retrieved all country items', result);
      res.send(result);
    });*/
    var clientServerOptions = {
      uri: 'https://autrip-cms.herokuapp.com/api/country',
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  }
  request(clientServerOptions, function (error, response) {
      console.log('>>>>Result of all country items', response.body);
      if(response.body) {
        console.log('>>>>Number of country items returned', response.body.length);
      }
      return res.send(response.body);
  });
});

router.get('/:countryId', function(req, res) {
  const countryId = req.params.countryId;
  console.log('>>>>Retrieve country by countryId', countryId);
  Ref.getCountry(countryId)
    .then((result) => {
      console.log('>>>>Retrieved country item', result);
      res.send(result);
    });
});

router.put('/', function(req, res) {
  const country = req.body;
  console.log('>>>>Insert country item', country);

  Ref.addCountry(country)
    .then(([result]) => {
      console.log('>>>>Inserted country item', result);
      res.send(result);
    });
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
    });
});

export default router;
