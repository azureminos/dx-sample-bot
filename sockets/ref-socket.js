/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== Module ================================================================
import CONSTANTS from '../lib/constants';
import ObjectParser from '../lib/object-parser';
// ===== DB ====================================================================
import Model from '../db/schema';
// ===== MESSENGER =============================================================

// Variables
const {SocketChannel} = CONSTANTS.get();
const SocketStatus = SocketChannel.Status;
// ===== HANDLER ===============================================================

const getDestinationList = (input) => {
  const {
    request,
    allInRoom,
    sendStatus,
    socket,
    socketUsers,
    userSocket,
  } = input;
  console.log('>>>>Socket.getDestinationList() start', {request});
  const {country} = request;
  Model.getDestinationList(country, (err, docs) => {
    if (err) {
      console.error('>>>>Model.getDestinationList error', err);
      sendStatus(SocketStatus.DB_ERROR);
    }
    console.log('>>>>Model.getDestinationList result', docs ? docs.length : 0);
    socket.emit('ref:destination', docs);
    sendStatus(SocketStatus.OK);
  });
};

export default {
  getDestinationList,
};
