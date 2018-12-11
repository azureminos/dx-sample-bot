/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== Module ================================================================
import _ from 'lodash';

// ===== DB ====================================================================
import Customer from '../models/customer';
import Packages from '../models/package';
import InstPackage from '../models/package-instance';
import InstItem from '../models/package-instance-item';
import PackageParticipant from '../models/package-instance-participant';

// ===== MESSENGER =============================================================
import userApi from '../messenger-api-helpers/user';
import sendApi from '../messenger-api-helpers/send';

// Find or Create a new/existing User with the given id.
const getUser = (senderId) => {
  return Customer.findOrCreate({
    loginId: senderId, // eslint-disable-line camelcase
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
        fbId: senderId,
      });
    });
  });
};

const getFacebookProfileInfoForUsers = (users = [], instId, socketUsers) =>
  Promise.all(users.map((user) => getUserDetails(user.loginId)))
    .then((res) => res.map((resUser = {}) => {
      // Detect online status via socketUser with matching list & FB IDs.
      const isOnline = [...socketUsers.values()].find((socketUser) =>
        socketUser.instId === instId && socketUser.userId === resUser.fbId);

      return Object.assign({}, resUser, {online: !!isOnline || false});
    }));

// Join Room, Update Necessary List Info, Notify All Users in room of changes.
const join = ({
  request: {senderId, instId},
  allInRoom,
  sendStatus,
  socket,
  socketUsers,
  userSocket,
}) => {
  console.log('>>>>Start to process User Join event with Input['+senderId+', '+instId+']');
  if (instId) {
    Promise.all([
      InstPackage.getInstPackageDetails(instId),
      InstPackage.getCityAttractionsByInstId(instId),
      InstPackage.getCityHotelsByInstId(instId),
      InstPackage.getCityiesByInstId(instId),
      PackageParticipant.getOwnerByInstId(instId),
      getUser(senderId),
    ]).then(([instPackage, cityAttractions, cityHotels, cities, instOwner, user]) => {
      if (!instPackage) {
        console.error("Package instance doesn't exist!");
        sendStatus('noInstPackage');
      }
      console.log('>>>>Print package instance before addUser', instPackage);
      PackageParticipant.addParticipant(instPackage.id, user.loginId)
        .then((usersInst) => {
          if (!instOwner) {
            allInRoom(instPackage.id).emit('instPackage:setOwnerId', usersInst.loginId);
          }
        })
        .then(() => {
          socketUsers.set(socket.id, {instId: instPackage.id, userId: user.loginId});

          PackageParticipant.getParticipantByInstId(instId)
            .then((users) => {
              console.log('>>>>Calling getFacebookProfileInfoForUsers', {users: users, instId: instId, socketUsers:socketUsers});
              return Promise.all([
                users,
                getFacebookProfileInfoForUsers(users, instId, socketUsers),
              ]);
            })
            .then(([users, fbUsers]) => {
              console.log('>>>>print users', users);
              console.log('>>>>print fbUsers', fbUsers);
              const ngUsers = fbUsers.map((u) => {
                var m = _.filter(users, (user) => {return user.loginId === u.fbId});
                if(m) {
                  u.likedAttractions = m[0].likedAttractions;
                }
                  return u;
              });
              console.log('>>>>print ngUsers', ngUsers);
              const viewerUser = fbUsers.find((fbUser) => fbUser.fbId === user.loginId);
              console.log('>>>>print viewerUser', viewerUser);
              console.log('>>>>socket.join(instPackage.id)', instPackage);
              socket.join(instPackage.id);
              console.log('>>>>socket.in(instPackage.id).emit(user:join, viewerUser)', viewerUser);
              socket.in(instPackage.id).emit('user:join', viewerUser);
              console.log('>>>>userSocket.emit(init)', {
                instPackage,
                cityAttractions,
                cityHotels,
                cities,
                users: ngUsers,
                packages: [],
                ownerId: instOwner ? instOwner.loginId : user.loginId,
              });
              userSocket.emit('init', {
                instPackage,
                cityAttractions,
                cityHotels,
                cities,
                users: ngUsers,
                packages: [],
                ownerId: instOwner ? instOwner.loginId : user.loginId,
              });
              console.log('>>>>Status OK');
              sendStatus('ok');
            });
        });
    });
  } else {
    Packages
      .getAllPromotedPackage()
      .then((packages) => {
        if (!packages) {
          console.error("No package available!");
          sendStatus('noPackage');
        } else {
          console.log('>>>>Print all packages', packages);
            userSocket.emit('pre-init', {
              packages,
            });
            sendStatus('ok');
        }
      });
  }
}

// Notify users in room when user leaves.
const leave = ({userId, instId, allInRoom, socket, socketUsers}) => {
  if (!userId) {
    console.error('User not registered to socket');
    return;
  }

  socketUsers.delete(socket.id);

  // Detect online status via socketUser with matching list & FB IDs.
  const onlineUsers =
    [...socketUsers.values()].reduce((onlineUsers, socketUser) => (
      (socketUser.instId === instId)
        ? [...onlineUsers, socketUser.userId]
        : onlineUsers
  ), []);

  allInRoom(instId).emit('users:setOnline', onlineUsers);
};

const updateLikedAttractions = ({request: {likedAttractions, instId}, sendStatus, socket, userId}) => {
  console.log('>>>>Received event to setLikedAttraction', {instId: instId, likedAttractions: likedAttractions, userId: userId});
  // Update user liked attractions
  PackageParticipant.updateLikedAttractions(instId, userId, likedAttractions);
  // Add/Delete attraction to vist in the package instance

  sendStatus('ok');
};

export default {join, leave, updateLikedAttractions};
