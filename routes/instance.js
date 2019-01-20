/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

// ===== DB ====================================================================
import InstPackage from '../models/package-instance';

const router = express.Router();

const handleInstanceCreation = (req, res) => {
  const {hostname} = req;
  const {DEMO, PORT, LOCAL} = process.env;
  const socketAddress = (DEMO && LOCAL) ? `http://${hostname}:${PORT}` : `wss://${hostname}`;

  const instId = req.params.instId;
  const packageId = req.params.packageId;

  console.log(
    '>>>>Printing input params',
    {packageId: packageId, instId: instId, socketAddress: socketAddress},
  );

  if (instId === 'new') {
    InstPackage
      .addInstPackage(packageId)
      .then((inst) =>
        res.render('./index', {instId: inst.id, socketAddress})
      );
  } else if (instId === 'home') {
    res.render('./index', {socketAddress});
  } else if (instId === 'view') {
    res.render('./index', {packageId, socketAddress});
  } else {
    res.render('./index', {instId, socketAddress});
  }
};

router.get('/:instId', handleInstanceCreation);
router.get('/:instId/:packageId', handleInstanceCreation);

export default router;
