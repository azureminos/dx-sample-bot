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
        console.log(`>>>>Capture event${channel}`, request);
        const {userId, instId} = socketUsers.get(socket.id) || {};

        handler({
          allInRoom,
          request,
          sendStatus,
          socket,
          socketUsers,
          userSocket,
          instId,
          userId,
        });
      });
    };

    console.log(`A user connected (socket ID ${socket.id})`);

    channel('disconnect', UserSocket.leave);
    channel('push:user:join', UserSocket.join);
    channel('push:package:create', PackageSocket.create);
    channel('push:package:view', PackageSocket.view);
    channel('push:likedAttractions:update', UserSocket.updateLikedAttractions);
  });
}
