/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== SOCKETS ===============================================================
import UserSocket from './user-socket';
import PackageSocket from './package-socket';

const socketUsers = new Map(); // {socketId: {userId, listId}}

export default function attachSockets(io) {
  io.on('connection', (socket) => {
    const allInRoom = (roomId) => io.sockets.in(roomId);
    const userSocket = io.sockets.connected[socket.id];

    const channel = (channel, handler) => {
      socket.on(channel, (request, sendStatus) => {
        console.log(`>>>>Captured event[${channel}] on socket[${socket.id}]`, {
          request,
          socketUsers,
        });
        const {senderId, instId} = socketUsers.get(socket.id) || {};
        let newRequest = {};
        console.log(`>>>>Socket Incoming Request [${typeof request}]`, {
          senderId,
          instId,
        });
        if (typeof request === 'object') {
          newRequest = {...request};
          if (!request.senderId) {
            console.log(
              `>>>>Socket Incoming Request.senderId[${senderId}]`,
              newRequest
            );
            newRequest.senderId = senderId;
          }
          if (!request.instId) {
            console.log(
              `>>>>Socket Incoming Request.instId[${instId}]`,
              newRequest
            );
            newRequest.instId = instId;
          }
        } else if (typeof request === 'string') {
          newRequest.senderId = senderId;
          newRequest.instId = instId;
        }
        console.log('>>>>before handler', newRequest);
        handler({
          allInRoom,
          request: newRequest,
          sendStatus,
          socket,
          socketUsers,
          userSocket,
        });
      });
    };

    console.log(`A user connected (socket ID ${socket.id})`);

    channel('disconnect', UserSocket.leave);
    channel('push:user:view', UserSocket.view);
    channel('push:user:join', UserSocket.joinPackage);
    channel('push:user:leave', UserSocket.leavePackage);
    channel('push:user:addNotes', UserSocket.addNotes);
    channel('push:package:share', PackageSocket.sharePackage);
    channel('push:package:update', PackageSocket.updatePackage);
    channel('push:likedAttractions:update', UserSocket.updateLikedAttractions);
  });
}
