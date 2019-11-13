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
// ===== MESSENGER =============================================================
import userApi from '../messenger-api-helpers/user';
import sendApi from '../messenger-api-helpers/send';

// Variables
const {Global, Instance} = CONSTANTS.get();
const InstanceStatus = Instance.status;

// Find or Create a new/existing User with the given id.
const getUser = (senderId, callback) => {
  return callback({
    loginId: senderId,
    source: 'facebook',
    profilePic: '',
    name: 'David Xia',
    email: '',
    mobile: '',
    phone: '',
  });
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

const view = (params) => {
  const {
    request,
    allInRoom,
    sendStatus,
    socket,
    socketUsers,
    userSocket,
  } = params;
  const {senderId, instId} = request;
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
      user: (callback) => {
        getUser(senderId, callback);
      },
    },
    function(err, results1) {
      if (err) {
        console.error('>>>>Database Error', err);
        sendStatus('DatabaseError');
      } else {
        const {
          instance,
          instanceItems,
          instanceHotels,
          instanceMembers,
          user,
        } = results1;
        if (!instance) {
          console.error(">>>>Package instance doesn't exist!");
          sendStatus('NoInstance');
        } else {
          console.log('>>>>Model.view Level 1 Result', results1);
          const packageSummary = instance.package;
          instance.package = packageSummary._id;
          instance.items = [...instanceItems];
          instance.hotels = [...instanceHotels];
          instance.members = [...instanceMembers];
          const getInstance = (inst, pack) => {
            async.parallel(
              {
                instance: (callback) => {
                  callback(null, inst);
                },
                cities: (callback) => {
                  Model.getCitiesByPackageId(pack._id, callback);
                },
                packageRates: (callback) => {
                  Model.getPackageRatesByPackageId(pack._id, callback);
                },
                flightRates: (callback) => {
                  Model.getFlightRatesByPackageId(pack._id, callback);
                },
              },
              function(err, results2) {
                if (err) {
                  console.error('>>>>Database Error', err);
                  sendStatus('DatabaseError');
                } else {
                  console.log('>>>>Model.view Level 2 Result', results2);
                  socket.emit('init', results2);
                }
              }
            );
          };
          if (instanceMembers && instanceMembers.length > 0) {
            // If not empty, then return existing instance details
            getInstance(instance, packageSummary);
          } else {
            // If empty list, then add current user and mark as owner
            const owner = {
              instPackage: instId,
              loginId: senderId,
              name: user.name,
              isOwner: true,
              status: InstanceStatus.INITIATED,
              people: Global.defaultPeople,
              rooms: Global.defaultRooms,
              createdAt: new Date(),
              createdBy: senderId,
            };
            instance.members = [owner];
            Model.createInstanceMembers(instance.members, (err, docs) => {
              if (err) {
                console.error('>>>>Database Error>>Failed to add member', err);
                sendStatus('DatabaseError');
              } else {
                getInstance(instance, packageSummary);
              }
            });
          }
        }
      }
    }
  );
};

// Join Room, Update Necessary List Info, Notify All Users in room of changes.
const join = () => {
  const {
    request,
    allInRoom,
    sendStatus,
    socket,
    socketUsers,
    userSocket,
  } = params;
  const {senderId, instId, people, rooms} = request;
};

// Notify users in room when user leaves.
const leave = ({userId, instId, allInRoom, socket, socketUsers}) => {
  if (!userId) {
    console.error('User not registered to socket');
    return;
  }

  socketUsers.delete(socket.id);

  // Detect online status via socketUser with matching list & FB IDs.
  const onlineUsers = [...socketUsers.values()].reduce(
    (onlineUsers, socketUser) =>
      socketUser.instId === instId
        ? [...onlineUsers, socketUser.userId]
        : onlineUsers,
    []
  );

  allInRoom(instId).emit('users:setOnline', onlineUsers);
};

// Add notes
const addNotes = ({request: {text}, userId, instId, allInRoom, sendStatus}) => {
  console.log('>>>>Calling addNotes', {text, userId, instId});
  const note = {
    instId: instId,
    userId: userId,
    text: text,
  };
  /* CaseNotes.addNotes(note).then((rs) => {
    console.log('>>>>addNotes.receiveAddedNotes', rs);
    allInRoom(instId).emit('user:addNotes', rs);
    sendStatus('ok');
  });*/
};

export default {
  view,
  join,
  leave,
  addNotes,
};
