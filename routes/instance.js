/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

// ===== DB ====================================================================
import PackageInstance from '../models/package-instance';

const router = express.Router();

const handleInstanceCreation = (req, res) => {
  //console.log('>>>>Print incoming msg', req);
  const {hostname} = req;
  const {DEMO, PORT, LOCAL} = process.env;
  const socketAddress = (DEMO && LOCAL) ? `http://${hostname}:${PORT}` : `wss://${hostname}`;

  const instId = req.params.instId;
  const packageId = req.params.packageId;

  console.log('>>>>Printing input params', {packageId: packageId, instId: instId, socketAddress: socketAddress, demo: DEMO});

  if (instId === 'new') {
    PackageInstance
      .addPackageInstance(packageId)
      .then((packageInst) =>
        res.render('./index', {instId: packageInst.id, socketAddress, demo: DEMO})
      )
  } else if (instId === 'home') {
    res.render('./index', {instId: null, socketAddress});
  } else {
    res.render('./index', {instId: instId, socketAddress, demo: DEMO});
  }
};

router.get('/:instId', handleInstanceCreation);
router.get('/:instId/:packageId', handleInstanceCreation);

export default router;
