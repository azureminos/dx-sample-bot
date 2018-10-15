import express from 'express';
import Ref from '../models/reference';

const router = express.Router();

router.get('/', function(req, res) {
  const query = req.body;
  console.log('>>>>Retrieve city', query);

  if(query) {
    if(query.countryId) {
      Ref.getCityByCountryId()
        .then((result) => {
          console.log('>>>>Retrieved all city items', result);
          res.send(result);
        });
    } else if(query.countryName) {
      Ref.getCityByCountryName()
        .then((result) => {
          console.log('>>>>Retrieved all city items', result);
          res.send(result);
        });
    } else {
      res.send([]);
    }
  } else {
    Ref.getAllCity()
      .then((result) => {
        console.log('>>>>Retrieved all city items', result);
        res.send(result);
      })
  }
});

router.get('/:cityId', function(req, res) {
  const cityId = req.params.cityId;
  console.log('>>>>Retrieve city by cityId', cityId);
  Ref.getCity(cityId)
    .then((result) => {
      console.log('>>>>Retrieved city item', result);
      res.send(result);
    })
});

router.put('/', function(req, res) {
  const city = req.body;
  console.log('>>>>Insert city item', city);

  Ref.addCity(city)
    .then(([result]) => {
      console.log('>>>>Inserted city item', result);
      res.send(result);
    })
});

router.post('/', function(req, res) {
  const city = req.body;
  console.log('>>>>Update city item', city);

  Ref.setCity(city)
    .then(([result]) => {
      console.log('>>>>Updated city item', result);
      res.send(result);
    })
});

router.delete('/', function(req, res) {
  const city = req.body;
  console.log('>>>>Delete city item', city);

  Ref.delCity(city.id)
    .then(() => {
      console.log('>>>>Deleted city item', city);
      res.send('ok');
    })
});

export default router;
