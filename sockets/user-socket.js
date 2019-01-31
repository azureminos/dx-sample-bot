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
import RatePlan from '../models/rate-plan';
import CaseNotes from '../models/package-instance-notes';

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
  const enter = ({
    request: {packages, instPackage, cityAttractions, cityHotels, cities, instOwner, rates, user},
    allInRoom,
    sendStatus,
    socket,
    socketUsers,
    userSocket,
  }) => {
    PackageParticipant.addParticipant(instPackage.id, user.loginId)
    .then((usersInst) => {
      if (!instOwner) {
        allInRoom(instPackage.id).emit('instPackage:setOwnerId', usersInst.loginId);
      }
    })
    .then(() => {
      socketUsers.set(socket.id, {instId: instPackage.id, userId: user.loginId});

      PackageParticipant.getParticipantByInstId(instPackage.id)
        .then((users) => {
          console.log('>>>>Calling getFacebookProfileInfoForUsers', {users: users, instId: instPackage.id, socketUsers: socketUsers});
          return Promise.all([
            users,
            getFacebookProfileInfoForUsers(users, instPackage.id, socketUsers),
          ]);
        })
        .then(([users, fbUsers]) => {
          console.log('>>>>print users', users);
          console.log('>>>>print fbUsers', fbUsers);
          const ngUsers = fbUsers.map((u) => {
            const m = _.filter(users, (user) => {return user.loginId === u.fbId;});
            if (m) {
              u.likedAttractions = m[0].likedAttractions;
            }
            return u;
          });

          const viewerUser = fbUsers.find((fbUser) => fbUser.fbId === user.loginId);
          socket.join(instPackage.id);
          console.log(`>>>>Send event[user:join] to users in room[${instPackage.id}]`, viewerUser);
          socket.in(instPackage.id).emit('user:join', viewerUser);

          // Dummy Hotels
          if (!instPackage.hotels) {
            instPackage.hotels = _.uniqBy(instPackage.items, 'dayNo').map((day) => {
              return cityHotels[day.city][0].id;
            });
          }

          console.log('>>>>Send event[init] to render webview', {
            instPackage,
            cityAttractions,
            cityHotels,
            cities,
            rates,
            users: ngUsers,
            packages: packages,
            ownerId: instOwner ? instOwner.loginId : user.loginId,
          });
          userSocket.emit('init', {
            instPackage,
            cityAttractions,
            cityHotels,
            cities,
            rates,
            users: ngUsers,
            packages: packages,
            ownerId: instOwner ? instOwner.loginId : user.loginId,
          });
          console.log('>>>>Status OK');
          sendStatus('ok');
        });
    });
  };

  console.log(`>>>>User[${senderId}] joined package instance[${instId}]`);
  if (instId) {
    Promise.all([
      InstPackage.getInstPackageDetails(instId),
      InstPackage.getCityAttractionsByInstId(instId),
      InstPackage.getCityHotelsByInstId(instId),
      InstPackage.getCitiesByInstId(instId),
      PackageParticipant.getOwnerByInstId(instId),
      RatePlan.getRateByInstId(instId),
      CaseNotes.getRateByInstId(instId),
      getUser(senderId),
    ]).then(([instPackage, cityAttractions, cityHotels, cities, instOwner, rates, user]) => {

      if (!instPackage) {
        console.error("Package instance doesn't exist!");
        sendStatus('noInstPackage');
      }
      console.log('>>>>Print package instance before addUser', instPackage);
      enter({
        request: {
          packages: [],
          instPackage,
          cityAttractions,
          cityHotels,
          cities,
          instOwner,
          rates,
          user,
        },
        allInRoom,
        sendStatus,
        socket,
        socketUsers,
        userSocket,
      });
    });
  } else {
    Promise.all([
      Packages.getAllPackage(),
      InstPackage.getLatestInstByUserId(senderId),
    ]).then(([packages, instPackage]) => {
      if (!packages) {
        console.error('No package available!');
        sendStatus('noPackage');
      } else {
        console.log('>>>>Print all packages', packages);
        console.log('>>>>Print instPackage', instPackage);
        Promise.all([
          packages,
          instPackage,
          InstPackage.getCityAttractionsByInstId(instPackage.id),
          InstPackage.getCityHotelsByInstId(instPackage.id),
          InstPackage.getCitiesByInstId(instPackage.id),
          PackageParticipant.getOwnerByInstId(instPackage.id),
          RatePlan.getRateByInstId(instPackage.id),
          getUser(senderId),
        ]).then(([packages, instPackage, cityAttractions, cityHotels, cities, instOwner, rates, user]) => {
          enter({
            request: {
              packages,
              instPackage,
              cityAttractions,
              cityHotels,
              cities,
              instOwner,
              rates,
              user,
            },
            allInRoom,
            sendStatus,
            socket,
            socketUsers,
            userSocket,
          });
        });
      }
    });
  }
};

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

const updateLikedAttractions = ({request, sendStatus, userId, instId}) => {
  const {likedAttractions} = request;
  console.log('>>>>Handle event[setLikedAttraction]', {request: request, userId: userId, instId: instId});
  // Update user liked attractions
  PackageParticipant.updateLikedAttractions(instId, userId, likedAttractions);
  // Add/Delete attraction to vist in the package instance

  sendStatus('ok');
};

export default {join, leave, updateLikedAttractions};
