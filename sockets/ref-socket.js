/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== Module ================================================================
import async from 'async';
import CONSTANTS from '../lib/constants';
import ObjectParser from '../lib/object-parser';
// ===== DB ====================================================================
import Model from '../db/schema';
// ===== MESSENGER =============================================================

// Variables
const {SocketChannel} = CONSTANTS.get();
const SocketStatus = SocketChannel.Status;
// ===== HANDLER ===============================================================

const getAllDestination = (input) => {
  const {
    request,
    allInRoom,
    sendStatus,
    socket,
    socketUsers,
    userSocket,
  } = input;
  console.log('>>>>Socket.getAllDestination() start', {request});
  const {country} = request;
  Model.getAllDestination(country, (err, docs) => {
    if (err) {
      console.error('>>>>Model.getAllDestination error', err);
      sendStatus(SocketStatus.DB_ERROR);
    }
    console.log('>>>>Model.getAllDestination result', docs ? docs.length : 0);
    socket.emit('ref:destination', docs);
    sendStatus(SocketStatus.OK);
  });
};

const getAllReference = (input) => {
  const {
    request,
    allInRoom,
    sendStatus,
    socket,
    socketUsers,
    userSocket,
  } = input;
  console.log('>>>>Socket.getAllReference() start', {request});
  const {country} = request;

  async.parallel(
    {
      destinations: (callback) => {
        Model.getAllDestination(country, callback);
      },
      tagGroups: (callback) => {
        Model.getAllTagGroup(null, callback);
      },
      categories: (callback) => {
        Model.getAllCategory(null, callback);
      },
    },
    function(err, result) {
      if (err) {
        console.error('>>>>Database Error', err);
        sendStatus(SocketStatus.DB_ERROR);
      } else {
        console.error('>>>>Database Results', result);
        socket.emit('ref:all', result);
      }
    }
  );

  Model.getAllDestination(country, (err, docs) => {
    if (err) {
      console.error('>>>>Model.getAllDestination error', err);
      sendStatus(SocketStatus.DB_ERROR);
    }
    console.log('>>>>Model.getAllDestination result', docs ? docs.length : 0);
    socket.emit('ref:destination', docs);
    sendStatus(SocketStatus.OK);
  });
};

export default {
  getAllDestination,
  getAllReference,
};
