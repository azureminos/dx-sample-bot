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
import Promos from '../models/promos';

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

// Send the intro message welcoming & describing the bot.
const sendIntroMessage = (recipientId) => {
  sendMessage(recipientId, messages.introMessage(APP_URL));
};

// Send the initial message welcoming & describing the bot.
const sendPromoMessage = (recipientId) => {
  Promos.getAllPromos()
      .then((promos) => {
        console.log('>>>>Printing all promotions', promos);
        sendMessage(recipientId, messages.promoMessage(APP_URL, promos));
      });
};

// Send the initial message welcoming & describing the bot.
const sendPromoMessage2 = (recipientId) => {
  Promos.getAllPromos()
      .then((promos) => {
        console.log('>>>>Printing all promotions', promos);
        sendMessage(recipientId, messages.promoMessage2(APP_URL, promos));
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
const sendListCreated = (recipientId, listId, title, promo) => {
  console.log('>>>>sendListCreated, recipientId['+recipientId+'], listId['+listId+'], title['+title+']');
  console.log('>>>>promo', promo);
  sendMessage(
    recipientId,
    [
      messages.listCreatedMessage,
      messages.shareListMessage(APP_URL, listId, promo.title, promo.id, 'Tour Details'),
    ]);
};

export default {
  sendListCreated,
  sendLists,
  sendMessage,
  sendNoListsYet,
  sendReadReceipt,
  sendIntroMessage,
  sendPromoMessage,
  sendPromoMessage2,
};
