/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';
import Model from '../db/schema';

const router = express.Router();

const handleWebviewAccess = (req, res) => {
  const {hostname} = req;
  const {PORT, LOCAL} = process.env;
  const socketAddress = LOCAL
    ? `http://${hostname}:${PORT}`
    : `wss://${hostname}`;

  const {instId, packageId} = req.params;

  console.log('>>>>Printing input params', {packageId, instId, socketAddress});

  if (instId === 'new') {
    const instance = {
      packageId: packageId,
      isCustomised: false,
    };
    Model.createInstanceByPackageId(instance, ({err, results}) => {
      if (err) {
        console.error('>>>>Model.createInstanceByPackageId Error', {
          err,
          results,
        });
      } else {
        console.log('>>>>Model.createInstanceByPackageId Success', {
          err,
          results,
        });
        res.render('./index', {instId: results.instance._id, socketAddress});
      }
    });
  } else if (instId === 'home') {
    res.render('./index', {instId: '', socketAddress});
  } else {
    res.render('./index', {instId, socketAddress});
  }
};

router.get('/', handleWebviewAccess);
router.get('/:instId', handleWebviewAccess);
router.get('/:instId/:packageId', handleWebviewAccess);

if (process.env.IS_CLEANUP === 'true') {
  Model.deleteAllInstanceMembers();
  Model.deleteAllInstanceItems();
  Model.deleteAllInstanceHotels();
  Model.deleteAllInstances();
}

export default router;
