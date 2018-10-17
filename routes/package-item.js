import express from 'express';
import PackageItem from '../models/package-item';

const router = express.Router();

router.get('/', function(req, res) {
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
  console.log('>>>>Retrieve package-item by itemId', countryId);
  PackageItem.getPackageItem(itemId)
    .then((result) => {
      console.log('>>>>Retrieved package-item item', result);
      res.send(result);
    })
});

router.put('/', function(req, res) {
  const item = req.body;
  console.log('>>>>Insert package-item item', item);

  PackageItem.addPackageItem(item)
    .then(([result]) => {
      console.log('>>>>Inserted package-item item', result);
      res.send(result);
    })
});

router.post('/', function(req, res) {
  const item = req.body;
  console.log('>>>>Update package-item item', item);

  PackageItem.setPackageItem(country)
    .then(([result]) => {
      console.log('>>>>Updated package-item item', result);
      res.send(result);
    })
});

router.delete('/', function(req, res) {
  const item = req.body;
  console.log('>>>>Delete package-item item', item);

  PackageItem.delPackageItem(item.id)
    .then(() => {
      console.log('>>>>Deleted package-item item', item);
      res.send('ok');
    })
});

export default router;
