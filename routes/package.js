import express from 'express';
import package from '../models/package';

const router = express.Router();

router.get('/', function(req, res) {
  const query = req.body;
  console.log('>>>>Retrieve package', query);

  if(query) {
    if(query.countryName) {
      Ref.getPackageByCountry()
        .then((result) => {
          console.log('>>>>Retrieved all package items by country['+query.countryName+']', result);
          res.send(result);
        });
    } else if(query.cityName) {
      Ref.getPackageByCity()
        .then((result) => {
          console.log('>>>>Retrieved all package items by city['+query.cityName+']', result);
          res.send(result);
        });
    } else if(query.isPromoted) {
      Ref.getAllPromotedPackage()
        .then((result) => {
          console.log('>>>>Retrieved all promoted package items', result);
          res.send(result);
        });
    } else {
      Ref.getAllPackage()
        .then((result) => {
          console.log('>>>>Retrieved all city items', result);
          res.send(result);
        });
    }
  } else {
    Ref.getAllCity()
      .then((result) => {
        console.log('>>>>Retrieved all city items', result);
        res.send(result);
      });
  }
});

router.get('/:packageId', function(req, res) {
  const packageId = req.params.packageId;
  console.log('>>>>Retrieve package by packageId', packageId);
  Ref.getPackage(packageId)
    .then((result) => {
      console.log('>>>>Retrieved package item', result);
      res.send(result);
    })
});

router.put('/', function(req, res) {
  const package = req.body;
  console.log('>>>>Insert package item', package);

  Ref.addPackage(package)
    .then(([result]) => {
      console.log('>>>>Inserted package item', result);
      res.send(result);
    })
});

router.post('/', function(req, res) {
  const package = req.body;
  console.log('>>>>Update package item', package);

  Ref.setPackage(package)
    .then(([result]) => {
      console.log('>>>>Updated package item', result);
      res.send(result);
    })
});

router.delete('/', function(req, res) {
  const package = req.body;
  console.log('>>>>Delete package item', package);

  Ref.delPackage(package.id)
    .then(() => {
      console.log('>>>>Deleted package item', package);
      res.send('ok');
    })
});

export default router;
