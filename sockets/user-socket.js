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

// Variables
const {Global, Instance, SocketChannel, Page} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const SocketAction = SocketChannel.Action;
const SocketStatus = SocketChannel.Status;

// ===== HANDLER ===============================================================
const getUserFromDB = (senderId, callback) => {
  Model.getUserByLoginId(senderId, (err, docs) => {
    if (err) {
      return console.error('>>>>Model.getUserByLoginId error', err);
    }
    console.log('>>>>Model.getUserByLoginId result', docs);
    return callback(err, docs);
  });
};
const getUserFromApi = (senderId, callback) => {
  userApi.getDetails(senderId, (err, {statusCode}, body) => {
    if (err) {
      return console.error('>>>>UserApi.getDetails error', err);
    } else if (statusCode !== 200) {
      return console.error('>>>>UserApi.getDetails error code', statusCode);
    }
    console.log('>>>>UserApi.getDetails result', body);
    const picUrl =
      body.picture && body.picture.data ? body.picture.data.url : '';
    const user = {
      name: body.name || senderId,
      loginId: senderId,
      profilePic: picUrl || '',
      source: 'facebook',
      isActive: true,
    };
    return Model.createUser(user, (err, docs) => {
      if (err) {
        console.error('>>>>Model.createMember error', err);
      }
      console.log('>>>>Model.createMember result', docs);
      return callback(err, docs);
    });
  });
};
const getUserDetails = (senderId, callback) => {
  if (process.env.IS_DUMMY_USER === 'true') {
    return callback(null, {
      loginId: senderId,
      source: 'facebook',
      profilePic: '',
      name: `FB User ${senderId}`,
      email: '',
      mobile: '',
      phone: '',
    });
  }
  return getUserFromDB(senderId, (err, dbUser) => {
    console.log('>>>>UserSocket.getUserFromDB', {err, dbUser});
    if (!dbUser || dbUser.length === 0) {
      return getUserFromApi(senderId, callback);
    }
    return callback(err, dbUser);
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
  console.log('>>>>Socket.view() start', {request, socketUsers});
  const {senderId, planId} = request;
  // Validate UserId and InstanceId
  if (!senderId) {
    console.error('User not registered to socket');
    sendStatus(SocketStatus.INVALID_USER);
    return;
  }
  if (!planId || planId === 'new' || planId === 'all') {
    console.log('>>>>Socket.view, send back user details');
    getUserDetails(senderId, (err, user) => {
      if (err) {
        console.error('>>>>Database Error', err);
        sendStatus(SocketStatus.DB_ERROR);
      } else {
        console.log('>>>>Model.view Level 2 Result', user);
        const homepage = planId === 'new' ? Page.NewPlan : Page.MainPage;
        socket.emit('init', {user, homepage});
        sendStatus(SocketStatus.OK);
      }
    });
  } else {
    console.log('>>>>Socket.view, prepare page[display trip]');
    // Persist socket details
    if (!socketUsers.get(socket.id)) {
      socketUsers.set(socket.id, {senderId});
      socket.join(planId);
    }
    // Get travel plan by ID
    const homepage = Page.ShowPlan;
  }
};

const listAllPlan = (input) => {
  const {
    request,
    allInRoom,
    sendStatus,
    socket,
    socketUsers,
    userSocket,
  } = input;
  console.log('>>>>Socket.listAllPlan() start', {request, socketUsers});
  const filter = {
    createdBy: request.senderId,
    status: {$in: [InstanceStatus.INITIATED, InstanceStatus.IN_PROGRESS]},
  };
  Model.findPlan(filter, (err, plans) => {
    if (err) {
      console.error('>>>>Model.findPlan failed', err);
    }
    console.log('>>>>Model.findPlan completed', plans);
    socket.emit('plan:all', plans);
  });
};

// Register User to Socket
const register = (input) => {
  const {request, allInRoom, sendStatus, socketUsers, socket} = input;
  const {senderId, planId} = request;
  console.log('>>>>Socket.register', {request, socketUsers});
  // Validate UserId and InstanceId
  if (!senderId) {
    console.error('Invalid user id');
    if (sendStatus) sendStatus(SocketStatus.INVALID_USER);
    return;
  }
  if (!planId) {
    console.error('>>>>Invalid Travel Plan ID');
    if (sendStatus) sendStatus(SocketStatus.INVALID_INSTANCE);
    return;
  }
  // Persist socket details
  if (!socketUsers.get(socket.id)) {
    socketUsers.set(socket.id, {planId, senderId});
    socket.join(planId);
  }
  if (sendStatus) sendStatus(SocketStatus.OK);
};

// Join Room, Update Necessary List Info, Notify All Users in room of changes.
const joinPlan = (input) => {
  console.log('>>>>Socket.joinPlan');
};
// User Leave Package
const leavePackage = (input) => {
  console.log('>>>>Socket.leavePackage');
};

// Notify users in room when user leaves.
const leave = (input) => {
  const {request, allInRoom, socket, socketUsers, sendStatus} = input;
  console.log('>>>>Socket.leave', {request, socketUsers});
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

export default {
  register,
  listAllPlan,
  view,
  joinPlan,
  leavePackage,
  leave,
  getUserDetails,
};
