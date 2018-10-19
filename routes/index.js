/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

const router = express.Router();
const {hostname} = req;
const {DEMO, PORT, LOCAL} = process.env;
const socketAddress = (DEMO && LOCAL) ? `http://${hostname}:${PORT}` : `wss://${hostname}`;

// GET home page
router.get('/', (_, res) => {
  console.log('>>>>print input into index2', {instId: null, socketAddress});
  res.render('./index2', {instId: null, socketAddress});
});

export default router;
