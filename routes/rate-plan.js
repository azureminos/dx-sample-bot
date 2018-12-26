import express from 'express';
import RatePlan from '../models/rate-plan';

const router = express.Router();

router.get('/', function(req, res) {
  const query = req.body;
  console.log('>>>>Retrieve rate-plan', query);

  if (query) {
    if (query.packageId) {
      if (query.rateType === 'package-rate') {
        RatePlan.getPackageRateByPackageId(query.packageId)
          .then((result) => {
            console.log('>>>>Retrieved all PackageRate items by packageId[' + query.packageId + ']', result);
            res.send(result);
          });
      } else if (query.rateType === 'car-rate') {
        RatePlan.getCarRateByPackageId(query.packageId)
          .then((result) => {
            console.log('>>>>Retrieved all CarRate items by packageId[' + query.packageId + ']', result);
            res.send(result);
          });
      } else if (query.rateType === 'flight-rate') {
        RatePlan.getFlightRateByPackageId(query.packageId)
          .then((result) => {
            console.log('>>>>Retrieved all FlightRate items by packageId[' + query.packageId + ']', result);
            res.send(result);
          });
      } else {
        RatePlan.getRateByPackageId(query.packageId)
          .then((result) => {
            console.log('>>>>Retrieved all rate items by packageId[' + query.packageId + ']', result);
            res.send(result);
          });
      }
    } else if (query.instId) {
      if (query.rateType === 'package-rate') {
        RatePlan.getPackageRateByInstId(query.instId)
          .then((result) => {
            console.log('>>>>Retrieved all PackageRate items by instId[' + query.instId + ']', result);
            res.send(result);
          });
      } else if (query.rateType === 'car-rate') {
        RatePlan.getCarRateByInstId(query.instId)
          .then((result) => {
            console.log('>>>>Retrieved all CarRate items by instId[' + query.instId + ']', result);
            res.send(result);
          });
      } else if (query.rateType === 'flight-rate') {
        RatePlan.getFlightRateByInstId(query.instId)
          .then((result) => {
            console.log('>>>>Retrieved all FlightRate items by instId[' + query.instId + ']', result);
            res.send(result);
          });
      } else {
        RatePlan.getRateByInstId(query.instId)
          .then((result) => {
            console.log('>>>>Retrieved all rate items by instId[' + query.instId + ']', result);
            res.send(result);
          });
      }
    }
  }
});

router.get('/:id', function(req, res) {
  const query = req.body;
  const id = req.params.id;
  console.log('>>>>Retrieve rate-plan by id', id);
  if (!query || !query.rateType || query.rateType === 'package-rate') {
    RatePlan.getPackageRate(id)
      .then((result) => {
        console.log('>>>>Retrieved PackageRate item by id[' + id + ']', result);
        res.send(result);
      });
  } else if (query.rateType === 'car-rate') {
    RatePlan.getCarRate(id)
      .then((result) => {
        console.log('>>>>Retrieved CarRate item by id[' + id + ']', result);
        res.send(result);
      });
  } else if (query.rateType === 'flight-rate') {
    RatePlan.getFlightRate(id)
      .then((result) => {
        console.log('>>>>Retrieved FlightRate item by id[' + id + ']', result);
        res.send(result);
      });
  }
});

router.put('/', function(req, res) {
  const item = req.body;
  console.log('>>>>Insert rate-plan item', item);
  if (!!item) {
    if (!item.rateType || item.rateType === 'package-rate') {
      RatePlan.addPackageRate(item)
        .then((result) => {
          console.log('>>>>Added PackageRate item', result);
          res.send(result);
        });
    } else if (item.rateType === 'car-rate') {
      RatePlan.addCarRate(item)
        .then((result) => {
          console.log('>>>>Added CarRate item', result);
          res.send(result);
        });
    } else if (item.rateType === 'flight-rate') {
      RatePlan.addFlightRate(item)
        .then((result) => {
          console.log('>>>>Added FlightRate item', result);
          res.send(result);
        });
    }
  }
});

router.post('/', function(req, res) {
  const item = req.body;
  console.log('>>>>Update rate-plan item', item);
  if (!!item) {
    if (!item.rateType || item.rateType === 'package-rate') {
      RatePlan.setPackageRate(item)
        .then((result) => {
          console.log('>>>>Updated PackageRate item', result);
          res.send(result);
        });
    } else if (item.rateType === 'car-rate') {
      RatePlan.setCarRate(item)
        .then((result) => {
          console.log('>>>>Updated CarRate item', result);
          res.send(result);
        });
    } else if (item.rateType === 'flight-rate') {
      RatePlan.setFlightRate(item)
        .then((result) => {
          console.log('>>>>Updated FlightRate item', result);
          res.send(result);
        });
    }
  }
});

router.delete('/', function(req, res) {
  const item = req.body;
  console.log('>>>>Delete rate-plan item', item);
  if (!!item) {
    if (!item.rateType || item.rateType === 'package-rate') {
      RatePlan.delPackageRate(item)
        .then((result) => {
          console.log('>>>>Deleted PackageRate item', result);
          res.send(result);
        });
    } else if (item.rateType === 'car-rate') {
      RatePlan.delCarRate(item)
        .then((result) => {
          console.log('>>>>Deleted CarRate item', result);
          res.send(result);
        });
    } else if (query.rateType === 'flight-rate') {
      RatePlan.delFlightRate(item)
        .then((result) => {
          console.log('>>>>Deleted FlightRate item', result);
          res.send(result);
        });
    }
  }
});

export default router;
