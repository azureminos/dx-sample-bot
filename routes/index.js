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

const handleSearchAttraction = (req, res) => {
  const {name} = req.body;
  console.log('>>>>Route.handleSearchAttraction', {name});
  Model.getAttractionByName(name, function(err, attractions) {
    if (!err) {
      console.log('>>>>Route.handleSearchAttraction Result', attractions);
      if (attractions && attractions.length > 0) {
        const a = attractions[0];
        return res.send({
          attraction: {
            _id: a._id,
            name: a.name,
            destId: a.primaryDestinationId,
          },
        });
      }
    }
    return res.send({error: 'no match'});
  });
};

router.get('/web', handleWebviewAccess);
router.get('/web/:userId/:type', handleWebviewAccess);
router.get('/web/:userId/:type/:id', handleWebviewAccess);
router.post('/api/tool/searchAttraction/', handleSearchAttraction);

Model.deletePlanItem({});
Model.deletePlanDay({});
Model.deletePlan({});

export default router;
