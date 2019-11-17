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
const sharePackage = (params) => {
  const {request, sendStatus} = params;
  const {senderId, input} = request;
  if (!input || !input.instId) {
    console.error('shareList: Invalid Package Instance ID');
    return;
  }
  sendApi.sendPackageShareItem(senderId, input);
  sendStatus('ok');
};

export default {
  sharePackage,
};
