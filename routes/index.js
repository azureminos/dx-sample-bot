/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';
import Model from '../db/schema';
import CONSTANTS from '../lib/constants';

const {Global} = CONSTANTS.get();
const router = express.Router();

const handleWebviewAccess = (req, res) => {
  const appId = Global.appId;
  const {hostname} = req;
  const {PORT, LOCAL} = process.env;
  const socketAddress = LOCAL
    ? `http://${hostname}:${PORT}`
    : `https://${hostname}`;

  const {userId, type, id} = req.params;

  console.log('>>>>Printing input params', {type, id});

  if (!type) {
    // Go to main page
    res.render('./index', {
      appId,
      userId,
      socketAddress,
    });
  } else if (type === 'plan') {
    // planId: new, go to pick date page
    // planId: id, go to selected plan page
    res.render('./index', {
      planId: id ? id : 'new',
      appId,
      userId,
      socketAddress,
    });
  }
};

const handleToolMatchActivity = (req, res) => {
  const {name} = req.params;
  console.log('>>>>Route.handleToolMatchActivity', {name});
  res.send({error: 'david test'});
};

router.get('/web', handleWebviewAccess);
router.get('/web/:userId/:type', handleWebviewAccess);
router.get('/web/:userId/:type/:id', handleWebviewAccess);
router.get('/api/tool/matchActivity/:name', handleToolMatchActivity);

export default router;
