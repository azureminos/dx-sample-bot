/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== Module ================================================================
import _ from 'lodash';

// ===== DB ====================================================================

// ===== SOCKET ================================================================

// ===== MESSENGER =============================================================
import sendApi from '../messenger-api-helpers/send';
// ===== HANDLER ===============================================================
const sharePackage = (input) => {
  console.log('>>>>Socket.sharePackage', input);
  const {request, sendStatus} = input;
  const {senderId, params} = request;
  if (!params || !params.instId) {
    console.error('shareList: Invalid Package Instance ID');
    return;
  }
  sendApi.sendPackageShareItem(senderId, params);
  sendStatus('ok');
};

const updatePackage = (input) => {
  console.log('>>>>Socket.updatePackage', input);
};

export default {
  sharePackage,
  updatePackage,
};
