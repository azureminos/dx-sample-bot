/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== LODASH ================================================================
import castArray from 'lodash/castArray';

// ===== MESSENGER =============================================================
import messages from './messages';
import api from './api';
import Package from '../models/package';

const {APP_URL} = process.env;

// Turns typing indicator on.
const typingOn = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on', // eslint-disable-line camelcase
  };
};

// Turns typing indicator off.
const typingOff = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_off', // eslint-disable-line camelcase
  };
};

// Wraps a message JSON object with recipient information.
const messageToJSON = (recipientId, messagePayload) => {
  return {
    recipient: {
      id: recipientId,
    },
    message: messagePayload,
  };
};

// Send one or more messages using the Send API.
const sendMessage = (recipientId, messagePayloads) => {
  const messagePayloadArray = castArray(messagePayloads)
    .map((messagePayload) => messageToJSON(recipientId, messagePayload));

  api.callMessagesAPI([
    typingOn(recipientId),
    ...messagePayloadArray,
    typingOff(recipientId),
  ]);
};

// Send a read receipt to indicate the message has been read
const sendReadReceipt = (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'mark_seen', // eslint-disable-line camelcase
  };

  api.callMessagesAPI(messageData);
};

// Send the initial welcoming message with quick reply options.
const sendWelcomeMessage = (recipientId, lastInstanceId) => {
  sendMessage(recipientId, messages.welcomeMessage(lastInstanceId));
};

// Send the initial message welcoming & describing the bot.
const sendPackageMessage = (recipientId) => {
  Package.getAllPackage()
      .then((packages) => {
        sendMessage(recipientId, messages.packageMessage(APP_URL, packages));
      });
};

// Let the user know that they don't have any lists yet.
const sendNoListsYet = (recipientId) => {
  sendMessage(recipientId, messages.noListsMessage(APP_URL));
};

// Show user the lists they are associated with.
const sendLists = (recipientId, action, lists, offset) => {
  console.log('>>>>sendLists, recipientId['+recipientId+'], action['+action+'], lists', lists);
  // Show different responses based on number of lists.
  switch (lists.length) {
  case 0:
    // Tell User they have no lists.
    sendNoListsYet(recipientId);
    break;
  case 1:
    // Show a single list — List view templates require
    // a minimum of 2 Elements. Rease More at:
    // https://developers.facebook.com/docs/
    // messenger-platform/send-api-reference/list-template
    const {id, title} = lists[0];

    sendMessage(
      recipientId,
      messages.shareListMessage(APP_URL, id, title, 'Open List'),
    );

    break;
  default:
    // Show a paginated set of lists — List view templates require
    // a maximum of 4 Elements. Rease More at:
    // https://developers.facebook.com/docs/
    // messenger-platform/send-api-reference/list-template
    sendMessage(
      recipientId,
      messages.paginatedListsMessage(APP_URL, action, lists, offset)
    );

    break;
  }
};

// Send a message notifying the user their list has been created.
const sendListCreated = (recipientId, instPackage) => {
  console.log('>>>>sendListCreated, recipientId['+recipientId+']', instPackage);
  sendMessage(
    recipientId,
    [
      messages.listCreatedMessage,
      messages.shareListMessage(APP_URL, instPackage.id, instPackage.title, instPackage.desc,
        instPackage.imageUrl, 'View Package'),
    ]);
};

// Send a message notifying the user their list has been created.
const sendPackageInst = (recipientId, inst) => {
  console.log(`>>>>sendPackageInst, recipientId[${recipientId}]`, inst);
  sendMessage(
    recipientId,
    [
      messages.listCreatedMessage,
      messages.shareListMessage(APP_URL, inst.id, inst.title, inst.desc,
        inst.imageUrl, 'View Package'),
    ]);
};

export default {
  sendListCreated,
  sendLists,
  sendMessage,
  sendNoListsYet,
  sendReadReceipt,
  sendPackageInst,
  sendPackageMessage,
  sendWelcomeMessage,
};
