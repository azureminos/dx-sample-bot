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
  const {DEMO, PORT, LOCAL} = process.env;
  const socketAddress =
    DEMO && LOCAL ? `http://${hostname}:${PORT}` : `wss://${hostname}`;

  const instId = req.params.instId;
  const packageId = req.params.packageId;

  console.log('>>>>Printing input params', {packageId, instId, socketAddress});

  if (instId === 'new') {
    Model.InstPackage.addInstPackage(packageId).then((inst) =>
      res.render('./index', {instId: inst.id, packageId: '', socketAddress})
    );
  } else if (instId === 'home') {
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
