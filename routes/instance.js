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
  const packageId = req.params.packageId;
  const socketAddress = (DEMO && LOCAL) ? `http://${hostname}:${PORT}` : `wss://${hostname}`;

  console.log('>>>>Printing input params', {packageId: packageId, socketAddress, demo: DEMO});
  PackageInstance
    .addPackageInstance(packageId)
    .then((pkg) => {
      res.render('./index2', {packageId: packageId, socketAddress, demo: DEMO});
    })
};

router.get('/:packageId', handleInstanceCreation);


export default router;
