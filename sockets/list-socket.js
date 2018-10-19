/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== DB ====================================================================
import Lists from '../models/lists';
import ListsItems from '../models/lists-items';

// Update the title of the given List and
// notifies all subscribed users of the change.
const updateTitle = ({request: {instId, title}, sendStatus, socket}) => {
  Lists.setTitle(title, instId)
    .then((list) => {
      socket.to(list.id).emit('title:update', list.title);
      sendStatus('ok');
    });
};

// Creates a new ListItem and notifies
// all subscribed users of the change.
const addItem = ({
  request: {senderId, instId, name},
  sendStatus,
  allInRoom,
}) => {
  ListsItems.create(name, instId, senderId)
    .then((listItem) => {
      allInRoom(instId).emit('item:add', listItem);
      sendStatus('ok');
    });
};

// Updates an existing ListItem and notifies
// all subscribed users of the change.
const updateItem = ({request, sendStatus, allInRoom}) => {
  const {instId, id, name, completerFbId} = request;
  console.log('request', {instId, id, name, completerFbId});

  ListsItems.update({id, name, completerFbId})
    .then(({id, name, completerFbId}) => {
      allInRoom(instId)
        .emit('item:update', {id, name, completerFbId});
      sendStatus('ok');
    });
};

export default {
  addItem,
  updateItem,
  updateTitle,
};
