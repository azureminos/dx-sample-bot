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
  const socketAddress = `http://${hostname}:${PORT}`;
  /*const socketAddress = LOCAL
    ? `http://${hostname}:${PORT}`
    : `wss://${hostname}`;*/

  const {userId, type, id} = req.params;

  console.log('>>>>Printing input params', {type, id});

  if (type === 'package') {
    Model.getPackageById(id, (err, docs) => {
      if (err) console.error('>>>>Model.getPackageById Error', err);
      console.log('>>>>Model.getPackageById Success', docs);
      const instance = {
        packageId: id,
        totalDays: docs.totalDays,
        carOption: docs.carOption,
        isCustomised: false,
      };
      Model.createInstanceByPackageId(instance, ({err, results}) => {
        if (err) {
          console.error('>>>>Model.createInstanceByPackageId Error', {
            err,
            results,
          });
        } else {
          console.log('>>>>Model.createInstanceByPackageId Success', {
            err,
            results,
          });
          res.render('./index', {
            instId: results.instance.id,
            packageId: '',
            appId,
            userId,
            socketAddress,
          });
        }
      });
    });
  } else if (type === 'package2') {
    res.render('./index', {
      instId: '',
      packageId: id,
      appId,
      userId,
      socketAddress,
    });
  } else if (type === 'home') {
    res.render('./index', {
      instId: '',
      packageId: '',
      appId,
      userId: '',
      socketAddress,
    });
  } else if (type === 'instance') {
    res.render('./index', {
      instId: id,
      packageId: '',
      appId,
      userId,
      socketAddress,
    });
  }
};

router.get('/:userId/:type', handleWebviewAccess);
router.get('/:userId/:type/:id', handleWebviewAccess);

if (process.env.IS_CLEANUP === 'true') {
  Model.deleteAllInstanceMembers();
  Model.deleteAllInstanceItems();
  Model.deleteAllInstanceHotels();
  Model.deleteAllInstances();
}

export default router;
