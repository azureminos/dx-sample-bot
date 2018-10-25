import express from 'express';
import PackageInstances from '../models/package-instance';

const router = express.Router();

/*router.get('/', function(req, res) {
  const query = req.body;
  console.log('>>>>Retrieve package-item', query);

  if(query) {
    if(query.packageId) {
      PackageItem.getItemByPackageId()
        .then((result) => {
          console.log('>>>>Retrieved all package-item items by packageId['+packageId+']', result);
          res.send(result);
        });
    } else if(query.packageName) {
      PackageItem.getItemByPackageName()
        .then((result) => {
          console.log('>>>>Retrieved all package-item items by packageName['+packageName+']', result);
          res.send(result);
        });
    } else {
      PackageItem.getAllPackageItem()
        .then((result) => {
          console.log('>>>>Retrieved all package-item items', result);
          res.send(result);
        });
    }
  } else {
    PackageItem.getAllPackageItem()
      .then((result) => {
        console.log('>>>>Retrieved all package-item items', result);
        res.send(result);
      });
  }
});

router.get('/:itemId', function(req, res) {
  const itemId = req.params.itemId;
  console.log('>>>>Retrieve package-item by itemId', itemId);
  PackageItem.getPackageItem(itemId)
    .then((result) => {
      console.log('>>>>Retrieved package-item item', result);
      res.send(result);
    })
});*/


router.put('/', function(req, res) {
  console.log('>>>>Insert package-instance item', req.body);
  const {packageId} = req.body;

  PackageInstances.addPackageInstance(packageId)
    .then((result) => {
      console.log('>>>>Inserted package-instance item', result);
      res.send(result);
    })
});


router.delete('/', function(req, res) {
  console.log('>>>>Delete package-instance item', req.body);
  const {packageInstId} = req.body;

  PackageInstances.delPackageInstance(packageInstId)
    .then(() => {
      console.log('>>>>Deleted package-instance item', packageInstId);
      res.send('ok');
    })
});

export default router;
