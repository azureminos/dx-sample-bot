/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== Module ================================================================
import _ from 'lodash';

// ===== DB ====================================================================
import Users from '../models/users';
import Packages from '../models/package';
import PackageInst from '../models/package-instance';
import PackageParticipant from '../models/package-instance-participant';

// ===== MESSENGER =============================================================
import userApi from '../messenger-api-helpers/user';
import sendApi from '../messenger-api-helpers/send';

// Find or Create a new/existing User with the given id.
const getUser = (senderId) => {
  return Users.findOrCreate({
    fb_id: senderId, // eslint-disable-line camelcase
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
  Promise.all(users.map((user) => getUserDetails(user.fbId)))
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
  if(instId) {
    Promise.all([
      PackageInst.getPackageInstanceDetails(instId),
      PackageInst.getAttractionsByInstId(instId),
      PackageParticipant.getOwnerByInstId(instId),
      getUser(senderId),
    ]).then(([packageInst, cityAttractions, instOwner, user]) => {
      if (!packageInst) {
        console.error("Package instance doesn't exist!");
        sendStatus('noPackageInst');
      }
      console.log('>>>>Print package instance before addUser', packageInst);
      PackageParticipant.addParticipant(packageInst.id, user.fbId)
        .then((usersInst) => {
          if (!instOwner) {
            allInRoom(packageInst.id).emit('packageInst:setOwnerId', usersInst.fbId);
          }
        })
        .then(() => {
          socketUsers.set(socket.id, {instId: packageInst.id, userId: user.fbId});

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
                var m = _.filter(users, (user) => {return user.fbId == u.fbId});
                if(m) {
                  u.likedAttractions = m[0].likedAttractions;
                }
                  return u;
              });

              const viewerUser =
                fbUsers.find((fbUser) => fbUser.fbId === user.fbId);
              socket.join(packageInst.id);
              socket.in(packageInst.id).emit('user:join', viewerUser);

              userSocket.emit('init', {
                packageInst,
                cityAttractions,
                users: ngUsers,
                packages: [],
                ownerId: instOwner ? instOwner.fbId : user.fbId,
              });

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
            userSocket.emit('init', {
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

const setLikedAttraction = ({request: {likedAttraction}, sendStatus, socket, userId}) => {
  console.log('>>>>Received event to setLikedAttraction', {likedAttraction: likedAttraction, userId: userId});
};

export default {join, leave, setLikedAttraction};
