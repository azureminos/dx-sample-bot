/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== Module ================================================================
import _ from 'lodash';
import async from 'async';
import CONSTANTS from '../lib/constants';
// ===== DB ====================================================================
import Model from '../db/schema';
// ===== SOCKET ================================================================

// ===== MESSENGER =============================================================
import sendApi from '../messenger-api-helpers/send';

// Variables
const {Instance, SocketChannel, TravelPackage} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const SocketAction = SocketChannel.Action;
const SocketStatus = SocketChannel.Status;
const PackageStatus = TravelPackage.status;

// ===== HANDLER ===============================================================
const createInstPackage = (input) => {
  const {request, sendStatus, socket, socketUsers} = input;
  console.log('>>>>Socket.createInstPackage', {request, socketUsers});
  const {packageId, totalDays, carOption, isCustomised, owner} = request;
};
const shareInstPackage = (input) => {
  const {request, sendStatus, socket, socketUsers} = input;
  const {senderId, instId, params} = request;
  console.log('>>>>Socket.shareInstPackage', {request, sendStatus});
  // Validate UserId and InstanceId
  if (!senderId) {
    console.error('shareList: Invalid User ID');
    sendStatus(SocketStatus.INVALID_USER);
    return;
  }
  if (!instId) {
    console.error('Invalid Package Instance ID');
    sendStatus(SocketStatus.INVALID_INSTANCE);
    return;
  }
  // Persist socket details
  if (!socketUsers.get(socket.id)) {
    socketUsers.set(socket.id, {instId, senderId});
  }
  sendApi.sendPackageShareItem(senderId, {...params, instId});
  sendStatus(SocketStatus.OK);
};

const updateInstPackage = (input) => {
  const {request, allInRoom, sendStatus, socket, socketUsers} = input;
  const {senderId, instId, action, params} = request;
  let output = {};
  console.log('>>>>Socket.updateInstPackage', {request, sendStatus});
  // Validate UserId and InstanceId
  if (!senderId) {
    console.error('shareList: Invalid User ID');
    sendStatus(SocketStatus.INVALID_USER);
    return;
  }
  if (!instId) {
    console.error('Invalid Package Instance ID');
    sendStatus(SocketStatus.INVALID_INSTANCE);
    return;
  }
  // Persist socket details
  if (!socketUsers.get(socket.id)) {
    socketUsers.set(socket.id, {instId, senderId});
  }
  // Check actions
  if (action === SocketAction.UPDATE_PEOPLE) {
    console.log('>>>>Start to process people update');
    async.parallel(
      {
        instance: (callback) => {
          const pInstance = {
            query: {
              _id: instId,
              status: InstanceStatus.INITIATED,
            },
            update: {
              status: params.statusInstance,
              updatedAt: new Date(),
              updatedBy: senderId,
            },
          };
          Model.updateInstance(pInstance, callback);
        },
        members: (callback) => {
          const pMembers = {
            query: {
              instPackage: instId,
              loginId: senderId,
            },
            update: {
              status: params.statusMember,
              people: params.people,
              rooms: params.rooms,
              updatedAt: new Date(),
              updatedBy: senderId,
            },
          };
          Model.updateInstanceMembers(pMembers, callback);
        },
      },
      function(err, result) {
        if (err) {
          console.error('>>>>Database Error', err);
          sendStatus(SocketStatus.DB_ERROR);
        } else {
          console.log(`>>>>Model.updatePackage[${action}] Result`, result);
          output = {...request};
          allInRoom(instId).emit('package:update', output);
          sendStatus(SocketStatus.OK);
        }
      }
    );
  } else if (action === SocketAction.UPDATE_ROOMS) {
    console.log('>>>>Start to process rooms update');
    async.parallel(
      {
        instance: (callback) => {
          const pInstance = {
            query: {
              _id: instId,
              status: InstanceStatus.INITIATED,
            },
            update: {
              status: params.statusInstance,
              updatedAt: new Date(),
              updatedBy: senderId,
            },
          };
          Model.updateInstance(pInstance, callback);
        },
        members: (callback) => {
          const pMembers = {
            query: {
              instPackage: instId,
              loginId: senderId,
            },
            update: {
              status: params.statusMember,
              rooms: params.rooms,
              updatedAt: new Date(),
              updatedBy: senderId,
            },
          };
          Model.updateInstanceMembers(pMembers, callback);
        },
      },
      function(err, result) {
        if (err) {
          console.error('>>>>Database Error', err);
          sendStatus(SocketStatus.DB_ERROR);
        } else {
          console.log(`>>>>Model.updatePackage[${action}] Result`, result);
          output = {...request};
          allInRoom(instId).emit('package:update', output);
          sendStatus(SocketStatus.OK);
        }
      }
    );
  } else if (action === SocketAction.UPDATE_DATE) {
    console.log('>>>>Start to process date update');
  }
};

const showAllPackages = (input) => {
  const {request, allInRoom, sendStatus, socket, socketUsers} = input;
  console.log('>>>>Socket.updatePackage', {request, socketUsers});
  const params = {isSnapshot: true, status: PackageStatus.PUBLISHED};
  Model.getFilteredPackages(params, (err, docs) => {
    if (err) console.log('>>>>Error.Model.getFilteredPackages', err);
    console.log('>>>>Model.getFilteredPackages result', docs);
    socket.emit('package:showAll', docs);
  });
};

export default {
  createInstPackage,
  shareInstPackage,
  updateInstPackage,
  showAllPackages,
};
