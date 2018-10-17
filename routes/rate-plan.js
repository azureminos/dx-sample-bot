import express from 'express';
import RatePlan from '../models/rate-plan';

const router = express.Router();

router.get('/', function(req, res) {
  const query = req.body;
  console.log('>>>>Retrieve rate-plan', query);

  if(query) {
    if(query.packageId) {
      RatePlan.getRatePlanByPackageId()
        .then((result) => {
          console.log('>>>>Retrieved all rate-plan items by packageId['+packageId+']', result);
          res.send(result);
        });
    } else if(query.packageName) {
      RatePlan.getRatePlanByPackageName()
        .then((result) => {
          console.log('>>>>Retrieved all rate-plan items by packageName['+packageName+']', result);
          res.send(result);
        });
    } else {
      RatePlan.getAllRatePlan()
        .then((result) => {
          console.log('>>>>Retrieved all rate-plan items', result);
          res.send(result);
        });
    }
  } else {
    RatePlan.getAllRatePlan()
      .then((result) => {
        console.log('>>>>Retrieved all rate-plan items', result);
        res.send(result);
      });
  }
});

router.get('/:itemId', function(req, res) {
  const itemId = req.params.itemId;
  console.log('>>>>Retrieve rate-plan by itemId', itemId);
  RatePlan.getRatePlan(itemId)
    .then((result) => {
      console.log('>>>>Retrieved rate-plan item', result);
      res.send(result);
    })
});

router.put('/', function(req, res) {
  const item = req.body;
  console.log('>>>>Insert rate-plan item', item);

  RatePlan.addRatePlan(item)
    .then(([result]) => {
      console.log('>>>>Inserted rate-plan item', result);
      res.send(result);
    })
});

router.post('/', function(req, res) {
  const item = req.body;
  console.log('>>>>Update rate-plan item', item);

  RatePlan.setRatePlan(country)
    .then(([result]) => {
      console.log('>>>>Updated rate-plan item', result);
      res.send(result);
    })
});

router.delete('/', function(req, res) {
  const item = req.body;
  console.log('>>>>Delete rate-plan item', item);

  RatePlan.delRatePlan(item.id)
    .then(() => {
      console.log('>>>>Deleted rate-plan item', item);
      res.send('ok');
    })
});

export default router;
