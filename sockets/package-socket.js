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
import UserSocket from './user-socket';
// ===== MESSENGER =============================================================
import sendApi from '../messenger-api-helpers/send';

// Variables
const {Global, Instance, SocketChannel, TravelPackage} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const SocketAction = SocketChannel.Action;
const SocketStatus = SocketChannel.Status;
const PackageStatus = TravelPackage.status;

// ===== HANDLER ===============================================================
const createInstPackage = (input) => {
  const {request, sendStatus, socket, socketUsers} = input;
  console.log('>>>>Socket.createInstPackage', {request, socketUsers});
  const {packageId, totalDays, carOption, senderId} = request;
  UserSocket.getUserDetails(senderId, (err, userDetails) => {
    const instance = {
      packageId: packageId,
      totalDays: totalDays,
      carOption: carOption,
      isCustomised: false,
      user: userDetails,
    };
    console.log('>>>>Model.createInstanceByPackageId Start', instance);
    Model.createInstanceByPackageId(instance, ({err, results}) => {
      if (err) {
        console.error('>>>>Model.createInstanceByPackageId Error', err);
      } else {
        console.log('>>>>Model.createInstanceByPackageId Success', results);
        // Archive all instances in INITIATED status and owned by user
        console.log('>>>>Model.archiveInstanceByUserId Start', senderId);
        Model.archiveInstanceByUserId({userId: senderId}, (err, docs) => {
          // Add current user and mark as owner
          const owner = {
            instPackage: results.instance._id,
            loginId: senderId,
            name: userDetails.name,
            isOwner: true,
            status: InstanceStatus.INITIATED,
            people: Global.defaultPeople,
            rooms: Global.defaultRooms,
            createdAt: new Date(),
            createdBy: senderId,
          };
          const newInstance = {
            ...results.instance._doc,
            items: results.items,
            hotels: results.hotels,
            members: [owner],
          };
          async.parallel(
            {
              instance: (callback) => {
                callback(null, newInstance);
              },
              packageSummary: (callback) => {
                Model.getPackageById(packageId, callback);
              },
              cities: (callback) => {
                Model.getCitiesByPackageId(packageId, callback);
              },
              packageRates: (callback) => {
                Model.getPackageRatesByPackageId(packageId, callback);
              },
              flightRates: (callback) => {
                Model.getFlightRatesByPackageId(packageId, callback);
              },
            },
            function(err, output) {
              if (err) {
                console.error('>>>>Database Error', err);
                sendStatus(SocketStatus.DB_ERROR);
              } else {
                console.info('>>>>Package Instance Created', output);
                // Persist socket details
                if (!socketUsers.get(socket.id)) {
                  const instId = output.instance._id;
                  socketUsers.set(socket.id, {instId, senderId});
                  socket.join(instId);
                }
                socket.emit('init', output);
                sendStatus(SocketStatus.OK);
              }
            }
          );
        });
      }
    });
  });
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

const showPackage = (input) => {
  const {request, allInRoom, sendStatus, socket, socketUsers} = input;
  console.log('>>>>Socket.updatePackage', {request, socketUsers});
  const {senderId, packageId} = request;
  async.parallel(
    {
      packageSummary: (callback) => {
        Model.getPackageById(packageId, callback);
      },
      packageItems: (callback) => {
        Model.getItemsByPackageId(packageId, callback);
      },
      packageHotels: (callback) => {
        Model.getHotelsByPackageId(packageId, callback);
      },
      cities: (callback) => {
        Model.getCitiesByPackageId(packageId, callback);
      },
      packageRates: (callback) => {
        Model.getPackageRatesByPackageId(packageId, callback);
      },
      flightRates: (callback) => {
        Model.getFlightRatesByPackageId(packageId, callback);
      },
    },
    function(err, results2) {
      if (err) {
        console.error('>>>>Database Error', err);
        sendStatus(SocketStatus.DB_ERROR);
      } else {
        console.log('>>>>Model.view Level 2 Result', results2);
        // socket.emit('init', results2);
        sendStatus(SocketStatus.OK);
      }
    }
  );

  /* Model.getDummyPackageInstance({senderId, packageId}, (err, docs) => {
    if (err) console.log('>>>>Model.getDummyPackageInstance error', err);
    console.log('>>>>Model.getDummyPackageInstance result', docs);
    socket.emit('init', docs);
  });*/
};

export default {
  createInstPackage,
  shareInstPackage,
  updateInstPackage,
  showAllPackages,
  showPackage,
};
