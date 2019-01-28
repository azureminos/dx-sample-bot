import express from 'express';
import Raw from '../models/raw-query';

const router = express.Router();

router.post('/', function(req, res) {
  const txtQuery = req.body.query;
  console.log('>>>>Received Query', txtQuery);
  if (txtQuery) {
    Raw.query(txtQuery)
      .then((result) => {
        res.send(result);
      });
  } else {
    res.send([]);
  }
});

export default router;
