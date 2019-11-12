/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

// ===== DB ====================================================================
import Model from '../db/schema';

const router = express.Router();

const handleInstanceCreation = (req, res) => {
  const {hostname} = req;
  const {PORT, LOCAL} = process.env;
  const socketAddress = LOCAL
    ? `http://${hostname}:${PORT}`
    : `wss://${hostname}`;

  const instId = req.params.instId;
  const packageId = req.params.packageId;

  console.log('>>>>Printing input params', {packageId, instId, socketAddress});

  if (instId === 'new') {
    const instance = {
      packageId: packageId,
      isCustomised: false,
    };
    Model.createInstanceByPackageId(instance, (inst) => {
      console.log('>>>>Instance Created', inst);
      res.render('./index', {instId: inst._id, packageId: '', socketAddress});
    });
  } else if (instId === 'home') {
    if (process.env.IS_CLEANUP === 'true') {
      Model.deleteAllInstanceMembers();
      Model.deleteAllInstanceItems();
      Model.deleteAllInstanceHotels();
      Model.deleteAllInstances();
    }

    res.render('./index', {instId: '', packageId: '', socketAddress});
  } else if (instId === 'view') {
    res.render('./index', {instId: '', packageId, socketAddress});
  } else {
    res.render('./index', {instId, packageId: '', socketAddress});
  }
};

router.get('/:instId', handleInstanceCreation);
router.get('/:instId/:packageId', handleInstanceCreation);

export default router;
