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
const {Global, Instance, SocketChannel} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const SocketAction = SocketChannel.Action;
const SocketStatus = SocketChannel.Status;

// ===== HANDLER ===============================================================
const sharePackage = (input) => {
  const {request, sendStatus} = input;
  const {senderId, instId, params} = request;
  console.log('>>>>Socket.sharePackage', {request, sendStatus});
  if (!senderId) {
    console.error('shareList: Invalid User ID');
    sendStatus(SocketStatus.INVALID_USER);
    return;
  }
  if (!instId) {
    console.error('shareList: Invalid Package Instance ID');
    sendStatus(SocketStatus.INVALID_INSTANCE);
    return;
  }
  sendApi.sendPackageShareItem(senderId, params);
  sendStatus(SocketStatus.OK);
};

const updatePackage = (input) => {
  const {request, allInRoom, sendStatus} = input;
  console.log('>>>>Socket.updatePackage', {request, sendStatus});
  const {senderId, instId, action, params} = request;
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
              status: params.status,
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
              status: InstanceStatus.IN_PROGRESS,
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
          allInRoom(instId).emit('package:update', params);
          sendStatus(SocketStatus.OK);
        }
      }
    );
  } else if (action === SocketAction.UPDATE_ROOMS) {
    console.log('>>>>Start to process rooms update');
  } else if (action === SocketAction.UPDATE_DATE) {
    console.log('>>>>Start to process date update');
  }
};

export default {
  sharePackage,
  updatePackage,
};
