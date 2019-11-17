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
import Model from '../db/schema';
import CONSTANTS from '../lib/constants';

const {TravelPackage} = CONSTANTS.get();
const PackageStatus = TravelPackage.status;
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
  const messagePayloadArray = castArray(messagePayloads).map((messagePayload) =>
    messageToJSON(recipientId, messagePayload)
  );

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
  const params = {isSnapshot: true, status: PackageStatus.PUBLISHED};
  Model.getFilteredPackages(params, (err, docs) => {
    if (err) console.log('>>>>Error.Model.getFilteredPackages', err);
    console.log('>>>>Model.getFilteredPackages', docs);
    sendMessage(recipientId, messages.packageMessage(APP_URL, docs));
  });
};

// Send a message notifying the user their list has been created.
const sendPackageInst = (recipientId, inst) => {
  console.log(`>>>>sendPackageInst, recipientId[${recipientId}]`, inst);
  sendMessage(
    recipientId,
    messages.sharePackageMessage(
      APP_URL,
      inst.id,
      inst.name,
      inst.description,
      inst.imageUrl
    )
  );
};

// Pass thread control to target app
const passThreadControl = (recipientId, targetAppId) => {
  console.log('PASSING THREAD CONTROL');
  const payload = {
    recipient: {
      id: recipientId,
    },
    target_app_id: targetAppId,
  };

  api.callPassControlAPI('/pass_thread_control', payload, () => {});
};

// Take control of the current thread
const takeThreadControl = (recipientId) => {
  console.log('TAKING THREAD CONTROL');
  const payload = {
    recipient: {
      id: recipientId,
    },
  };

  api.callTakeControlAPI('/take_thread_control', payload, () => {});
};

const sendPackageShareItem = (recipientId, input) => {
  const {instId, title, description, imageUrl} = input;
  sendMessage(recipientId, [
    messages.packageShareMessage,
    messages.sharePackageMessage(APP_URL, instId, title, description, imageUrl),
  ]);
};

export default {
  sendMessage,
  sendReadReceipt,
  sendPackageInst,
  sendPackageMessage,
  sendWelcomeMessage,
  sendPackageShareItem,
  passThreadControl,
  takeThreadControl,
};
