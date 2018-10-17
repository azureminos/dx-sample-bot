import express from 'express';
import Attraction from '../models/attraction';

const router = express.Router();

router.get('/', function(req, res) {
  const query = req.body;
  console.log('>>>>Retrieve attraction', query);

  if(query) {
    if(query.cityId) {
      Attraction.getAttractionByCityId()
        .then((result) => {
          console.log('>>>>Retrieved all attraction items by city id['+query.cityId+']', result);
          res.send(result);
        });
    } else if(query.cityName) {
      Attraction.getAttractionByCityName()
        .then((result) => {
          console.log('>>>>Retrieved all attraction items by city name['+query.cityName+']', result);
          res.send(result);
        });
    } else {
      Attraction.getAllAttraction()
        .then((result) => {
          console.log('>>>>Retrieved all attraction items', result);
          res.send(result);
        });
    }
  } else {
    Attraction.getAllAttraction()
      .then((result) => {
        console.log('>>>>Retrieved all attraction items', result);
        res.send(result);
      });
  }
});

router.get('/:attractionId', function(req, res) {
  const attractionId = req.params.attractionId;
  console.log('>>>>Retrieve city by attractionId', attractionId);
  Attraction.getAttraction(attractionId)
    .then((result) => {
      console.log('>>>>Retrieved attraction item', result);
      res.send(result);
    })
});

router.put('/', function(req, res) {
  const attraction = req.body;
  console.log('>>>>Insert attraction item', attraction);

  Attraction.addAttraction(attraction)
    .then(([result]) => {
      console.log('>>>>Inserted attraction item', result);
      res.send(result);
    })
});

router.post('/', function(req, res) {
  const attraction = req.body;
  console.log('>>>>Update attraction item', attraction);

  Attraction.setAttraction(attraction)
    .then(([result]) => {
      console.log('>>>>Updated attraction item', result);
      res.send(result);
    })
});

router.delete('/', function(req, res) {
  const attraction = req.body;
  console.log('>>>>Delete attraction item', attraction);

  Attraction.delAttraction(attraction.id)
    .then(() => {
      console.log('>>>>Deleted city item', city);
      res.send('ok');
    })
});

router.get('/image/:attractionId', function(req, res) {
  const attractionId = req.params.attractionId;
  console.log('>>>>Retrieve image url by attractionId['+attractionId+']');
  Attraction.getAttractionImageUrl(attractionId)
    .then((result) => {
      console.log('>>>>Retrieve image url by attractionId['+attractionId+']', result);
      res.send(result);
    })
});

router.post('/image/:attractionId', function(req, res) {
  const attractionId = req.params.attractionId;
  const imageUrl = req.body.imageUrl;
  console.log('>>>>update image url by attractionId['+attractionId+']', imageUrl);
  /*Attraction.getAttraction(attractionId)
    .then((result) => {
      console.log('>>>>Retrieved attraction item', result);
      res.send(result);
    })*/
});
export default router;
