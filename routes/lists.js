/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

// ===== DB ====================================================================
import Lists from '../models/lists';

const router = express.Router();

router.get('/:promoId/:listId', (req, res) => {
  console.log('>>>>Print incoming msg', req);
  const {hostname} = req;
  const {DEMO, PORT, LOCAL} = process.env;
  const reqId = req.params.listId;
  const promoId = req.params.promoId;
  const socketAddress = (DEMO && LOCAL) ?
    `http://${hostname}:${PORT}` : `wss://${hostname}`;

  if (reqId === 'new') {
    Lists.create().then(({id}) => {
      res.render('./index', {listId: id, promoId: promoId, socketAddress, demo: DEMO});
    });
  } else {
    res.render('./index', {listId: reqId, promoId: promoId, socketAddress, demo: DEMO});
  }
});

export default router;
