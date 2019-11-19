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
import ObjectParser from '../lib/object-parser';
// ===== DB ====================================================================
import Model from '../db/schema';
// ===== MESSENGER =============================================================
import userApi from '../messenger-api-helpers/user';
import sendApi from '../messenger-api-helpers/send';

// Variables
const {Global, Instance, SocketChannel} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const SocketStatus = SocketChannel.Status;

// ===== HANDLER ===============================================================
// Find or Create a new/existing User with the given id.
const getUser = (senderId) => {
  return {
    loginId: senderId,
    source: 'facebook',
    profilePic: '',
    name: `FB User ${senderId}`,
    email: '',
    mobile: '',
    phone: '',
  };
};

// Promise wrapper for Facebook UserApi.
const getUserDetails = (senderId) => {
  return new Promise((resolve, reject) => {
    userApi.getDetails(senderId, (err, {statusCode}, body) => {
      if (err) {
        return reject(err);
      } else if (statusCode !== 200) {
        return reject({
          statusCode,
          message: 'Unable to fetch user data for user',
          senderId,
        });
      }

      return resolve({
        name: body.first_name || body.last_name || senderId,
        profilePic: body.profile_pic,
        loginId: senderId,
      });
    });
  });
};

const getFacebookProfileInfoForUsers = (users = [], instId, socketUsers) => {
  Promise.all(users.map((user) => getUserDetails(user.loginId))).then((res) =>
    res.map((resUser = {}) => {
      // Detect online status via socketUser with matching list & FB IDs.
      const isOnline = [...socketUsers.values()].find(
        (socketUser) =>
          socketUser.instId === instId && socketUser.userId === resUser.fbId
      );
      return Object.assign({}, resUser, {online: !!isOnline || false});
    })
  );
};

const view = (input) => {
  const {
    request,
    allInRoom,
    sendStatus,
    socket,
    socketUsers,
    userSocket,
  } = input;
  console.log('>>>>Socket.view start', {request, socketUsers, sendStatus});
  const {senderId, instId} = request;
  // Persist socket details
  if (!socketUsers.get(socket.id)) {
    socketUsers.set(socket.id, {instId, senderId});
  }
  // Get instance details (package, attractions, hotels, members)
  async.parallel(
    {
      instance: (callback) => {
        Model.getInstanceByInstId(instId, callback);
      },
      instanceItems: (callback) => {
        Model.getInstanceItemsByInstId(instId, callback);
      },
      instanceHotels: (callback) => {
        Model.getInstanceHotelsByInstId(instId, callback);
      },
      instanceMembers: (callback) => {
        Model.getInstanceMembersByInstId(instId, callback);
      },
    },
    function(err, results1) {
      if (err) {
        console.error('>>>>Database Error', err);
        sendStatus(SocketStatus.DB_ERROR);
      } else {
        const {
          instance,
          instanceItems,
          instanceHotels,
          instanceMembers,
        } = results1;
        if (!instance) {
          console.error(">>>>Package instance doesn't exist!");
          sendStatus(SocketStatus.NO_INSTANCE);
        } else {
          console.log('>>>>Model.view Level 1 Result', results1);
          const packageSummary = ObjectParser.parseTravelPackage(
            instance.package
          );
          instance.package = packageSummary.id;
          instance.items = [...instanceItems];
          instance.hotels = [...instanceHotels];
          instance.members = [...instanceMembers];
          const getInstance = (inst, pack) => {
            async.parallel(
              {
                instance: (callback) => {
                  callback(null, inst);
                },
                packageSummary: (callback) => {
                  callback(null, pack);
                },
                cities: (callback) => {
                  Model.getCitiesByPackageId(pack.id, callback);
                },
                packageRates: (callback) => {
                  Model.getPackageRatesByPackageId(pack.id, callback);
                },
                flightRates: (callback) => {
                  Model.getFlightRatesByPackageId(pack.id, callback);
                },
              },
              function(err, results2) {
                if (err) {
                  console.error('>>>>Database Error', err);
                  sendStatus(SocketStatus.DB_ERROR);
                } else {
                  console.log('>>>>Model.view Level 2 Result', results2);
                  socket.emit('init', results2);
                  sendStatus(SocketStatus.OK);
                }
              }
            );
          };
          if (instanceMembers && instanceMembers.length > 0) {
            // If not empty, then return existing instance details
            getInstance(instance, packageSummary);
          } else {
            // If empty list, then add current user and mark as owner
            const userDetails = getUser(senderId);
            const owner = {
              instPackage: instId,
              loginId: senderId,
              name: userDetails.name,
              isOwner: true,
              status: InstanceStatus.INITIATED,
              people: Global.defaultPeople,
              rooms: Global.defaultRooms,
              createdAt: new Date(),
              createdBy: senderId,
            };
            instance.members = [owner];
            async.parallel(
              {
                member: (callback) => {
                  Model.createInstanceMembers(instance.members, callback);
                },
                instance: (callback) => {
                  const params = {
                    query: {_id: instId},
                    update: {createdBy: senderId},
                  };
                  Model.updateInstance(params, callback);
                },
              },
              function(err, output) {
                if (err) {
                  console.error('>>>>Database Error', err);
                  sendStatus(SocketStatus.DB_ERROR);
                } else {
                  getInstance(instance, packageSummary);
                }
              }
            );
          }
        }
      }
    }
  );
};

// Join Room, Update Necessary List Info, Notify All Users in room of changes.
const joinPackage = (input) => {
  const {request, allInRoom, sendStatus} = input;
  const {senderId, instId, people, rooms} = request;
  console.log('>>>>Socket.joinPackage', {request, sendStatus});
  if (!senderId) {
    console.error('User not registered to socket');
    sendStatus(SocketStatus.INVALID_USER);
    return;
  }
  const userDetails = getUser(senderId);
  const member = {
    instPackage: instId,
    loginId: senderId,
    name: userDetails.name,
    isOwner: false,
    status: InstanceStatus.INITIATED,
    people: people,
    rooms: rooms,
    createdAt: new Date(),
    createdBy: senderId,
  };
  Model.createInstanceMembers(member, (err, docs) => {
    if (err) {
      console.log('>>>>Model.createInstanceMembers error', err);
      sendStatus(SocketStatus.DB_ERROR);
    } else {
      console.log('>>>>Model.createInstanceMembers completed', docs);
      allInRoom(instId).emit('user:join', member);
      sendStatus(SocketStatus.OK);
    }
  });
};

// User Join Package
const leavePackage = (input) => {
  const {request, allInRoom, sendStatus} = input;
  const {senderId, instId} = request;
  console.log('>>>>Socket.leavePackage', {request, sendStatus});
  if (!senderId) {
    console.error('User not registered to socket');
    sendStatus(SocketStatus.INVALID_USER);
    return;
  }
  const params = {
    instPackage: instId,
    loginId: senderId,
  };
  Model.deleteInstanceByParams(params, (err) => {
    if (err) {
      console.log('>>>>Model.deleteInstanceByParams error', err);
      sendStatus(SocketStatus.DB_ERROR);
    } else {
      console.log('>>>>Model.deleteInstanceByParams completed');
      allInRoom(instId).emit('user:leave', senderId);
      sendStatus(SocketStatus.OK);
    }
  });
};

// Notify users in room when user leaves.
const leave = (input) => {
  console.log('>>>>Socket.leave', input);
  // const {request, allInRoom, socket, socketUsers, sendStatus} = input;
  /* const {senderId} = request;
  if (!senderId) {
    console.error('User not registered to socket');
    return;
  }

  socketUsers.delete(socket.id);

  // Detect online status via socketUser with matching list & FB IDs.
  const onlineUsers = [...socketUsers.values()].reduce(
    (onlineUsers, socketUser) =>
      socketUser.instId === instId
        ? [...onlineUsers, socketUser.senderId]
        : onlineUsers,
    []
  );

  allInRoom(instId).emit('users:setOnline', onlineUsers);*/
};

// Add notes
const addNotes = (input) => {
  const {
    request: {userId, instId, text},
    allInRoom,
    sendStatus,
  } = input;
  console.log('>>>>Calling addNotes', {text, userId, instId});
  const note = {
    instId: instId,
    userId: userId,
    text: text,
  };
  /* CaseNotes.addNotes(note).then((rs) => {
    console.log('>>>>addNotes.receiveAddedNotes', rs);
    allInRoom(instId).emit('user:addNotes', rs);
  });*/
  sendStatus(SocketStatus.OK);
};

export default {
  view,
  joinPackage,
  leavePackage,
  leave,
  addNotes,
};
