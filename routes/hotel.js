import express from 'express';
import Ref from '../models/hotel';

const router = express.Router();

router.get('/', function(req, res) {
  const query = req.body;
  console.log('>>>>Retrieve hotel', query);

  if (query) {
    if (query.cityId) {
      Ref.getHotelByCityId()
        .then((result) => {
          console.log('>>>>Retrieved all hotel items', result);
          res.send(result);
        });
    } else if (query.cityName) {
      Ref.getHotelByCityName()
        .then((result) => {
          console.log('>>>>Retrieved all hotel items', result);
          res.send(result);
        });
    } else {
      Ref.getAllHotel()
        .then((result) => {
          console.log('>>>>Retrieved all hotel items', result);
          res.send(result);
        });
    }
  } else {
    Ref.getAllHotel()
      .then((result) => {
        console.log('>>>>Retrieved all hotel items', result);
        res.send(result);
      });
  }
});

router.get('/:hotelId', function(req, res) {
  const hotelId = req.params.hotelId;
  console.log('>>>>Retrieve hotel by hotelId', hotelId);
  Ref.getHotel(hotelId)
    .then((result) => {
      console.log('>>>>Retrieved hotel item', result);
      res.send(result);
    });
});

router.put('/', function(req, res) {
  const hotel = req.body;
  console.log('>>>>Insert hotel item', hotel);

  Ref.addHotel(hotel)
    .then((result) => {
      console.log('>>>>Inserted hotel item', result);
      res.send(result);
    });
});

router.post('/', function(req, res) {
  const hotel = req.body;
  console.log('>>>>Update hotel item', hotel);

  Ref.setHotel(hotel)
    .then((result) => {
      console.log('>>>>Updated hotel item', result);
      res.send(result);
    });
});

router.delete('/', function(req, res) {
  const hotel = req.body;
  console.log('>>>>Delete hotel item', hotel);

  Ref.delHotel(hotel.id)
    .then(() => {
      console.log('>>>>Deleted hotel item', hotel);
      res.send('ok');
    });
});

export default router;
