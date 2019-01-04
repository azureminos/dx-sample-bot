/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== Module ================================================================
import _ from 'lodash';

// ===== DB ====================================================================
import InstPackage from '../models/package-instance';

// ===== SOCKET ================================================================
import UserSocket from '../sockets/user-socket';

// ===== MESSENGER =============================================================


// ===== HANDLER ===============================================================
// Create package instance
const create = ({request: {senderId, packageId}, allInRoom, sendStatus, socket, socketUsers, userSocket}) => {
  console.log('>>>>Received event to create package instance', {packageId: packageId, senderId: senderId});
  InstPackage
    .addInstPackage(packageId)
    .then((inst) => {
      console.log('>>>>Created package instance', inst);
      // User(owner) join
      UserSocket.join({
        request: {senderId: senderId, instId: inst.id},
        allInRoom,
        sendStatus,
        socket,
        socketUsers,
        userSocket,
      });
    }
  );
};

export default {create};
