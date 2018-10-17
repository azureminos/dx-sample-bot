import express from 'express';
import Pkg from '../models/package';

const router = express.Router();

router.get('/', function(req, res) {
  const query = req.body;
  console.log('>>>>Retrieve package', query);

  if(query) {
    if(query.countryName) {
      Pkg.getPackageByCountry()
        .then((result) => {
          console.log('>>>>Retrieved all package items by country['+query.countryName+']', result);
          res.send(result);
        });
    } else if(query.cityName) {
      Pkg.getPackageByCity()
        .then((result) => {
          console.log('>>>>Retrieved all package items by city['+query.cityName+']', result);
          res.send(result);
        });
    } else if(query.isPromoted) {
      Pkg.getAllPromotedPackage()
        .then((result) => {
          console.log('>>>>Retrieved all promoted package items', result);
          res.send(result);
        });
    } else {
      Pkg.getAllPackage()
        .then((result) => {
          console.log('>>>>Retrieved all city items', result);
          res.send(result);
        });
    }
  } else {
    Pkg.getAllPackage()
      .then((result) => {
        console.log('>>>>Retrieved all city items', result);
        res.send(result);
      });
  }
});

router.get('/:packageId', function(req, res) {
  const packageId = req.params.packageId;
  console.log('>>>>Retrieve package by packageId', packageId);
  Pkg.getPackage(packageId)
    .then((result) => {
      console.log('>>>>Retrieved package item', result);
      res.send(result);
    })
});

router.put('/', function(req, res) {
  const pkg = req.body;
  console.log('>>>>Insert package item', pkg);

  Pkg.addPackage(pkg)
    .then(([result]) => {
      console.log('>>>>Inserted package item', result);
      res.send(result);
    })
});

router.post('/', function(req, res) {
  const pkg = req.body;
  console.log('>>>>Update package item', pkg);

  Pkg.setPackage(pkg)
    .then(([result]) => {
      console.log('>>>>Updated package item', result);
      res.send(result);
    })
});

router.delete('/', function(req, res) {
  const pkg = req.body;
  console.log('>>>>Delete package item', pkg);

  Pkg.delPackage(pkg.id)
    .then(() => {
      console.log('>>>>Deleted package item', pkg);
      res.send('ok');
    })
});

export default router;
