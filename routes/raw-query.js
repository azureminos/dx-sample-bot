import express from 'express';
import Raw from '../models/raw-query';

const router = express.Router();

router.post('/', function(req, res) {
  const txtQuery = req.body;
  console.log('>>>>Received Query', txtQuery);

  Raw.query(txtQuery)
    .then((result) => {
      res.send(result);
    });
});

export default router;
