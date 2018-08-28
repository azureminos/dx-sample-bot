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

const handleListCreation = (req, res) => {
  //console.log('>>>>Print incoming msg', req);
  const {hostname} = req;
  const {DEMO, PORT, LOCAL} = process.env;
  const reqId = req.params.listId;
  const promoId = req.params.promoId || 3;
  const socketAddress = (DEMO && LOCAL) ? `http://${hostname}:${PORT}` : `wss://${hostname}`;
  
  console.log('>>>>Printing input params', {listId: reqId, promoId: promoId, socketAddress, demo: DEMO});
  
  if (reqId === 'new') {
    Lists.create('Holiday Destination', Number(promoId)).then(({id}) => {
      res.render('./index', {listId: id, socketAddress, demo: DEMO});
    });
  } else {
    res.render('./index', {listId: reqId, socketAddress, demo: DEMO});
  }
};

router.get('/:listId', handleListCreation);

router.get('/:promoId/:listId', handleListCreation);

export default router;
