import express from 'express';
import Ref from '../models/reference';

const router = express.Router();

router.get('/', function(req, res) {
  console.log('>>>>Retrieve all region items');
  Ref.getAllRegion()
    .then((result) => {
      console.log('>>>>Retrieved all region items');
      res.send(result);
    })
});

export default router;
