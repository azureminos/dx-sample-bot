/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MESSENGER =============================================================
import sendApi from './send';
// ===== MODELS ================================================================
import Model from '../db/schema';
// ===== HELPERS =============================================================
import ObjectParser from '../lib/object-parser';
import CONSTANTS from '../lib/constants';

const InstanceStatus = CONSTANTS.get().Instance.status;
/*
 * handleReceivePostback — Postback event handler triggered by a postback
 * action you, the developer, specify on a button in a template. Read more at:
 * developers.facebook.com/docs/messenger-platform/webhook-reference/postback
 */
const handleReceivePostback = (event) => {
  /**
   * The 'payload' param is a developer-defined field which is
   * set in a postbackbutton for Structured Messages.
   *
   * In this case we've defined our payload in our postback
   * actions to be a string that represents a JSON object
   * containing `type` and `data` properties. EG:
   */
  console.log('>>>>Receive.handleReceivePostback', event);

  const type = event.postback.payload;
  const senderId = event.sender.id;

  // Perform an action based on the type of payload received.
  if (type.substring(0, 11) === 'get_started') {
    // Greeting and quick reply
    const filter = {
      createdBy: senderId,
      status: {
        $in: [InstanceStatus.INITIATED, InstanceStatus.DEPOSIT_PAID],
      },
    };
    Model.findPlan(filter, (err, res) => {
      if (err) {
        console.error('>>>>Model.findPlan failed', err);
      }
      console.log('>>>>Model.findPlan completed', res);
      sendApi.sendWelcomeMessage(senderId, res);
    });
  } else if (type.substring(0, 15) === 'handover_thread') {
    // Handover to page inbox
  } else if (type.startsWith('FB##')) {
    const planId = type.substring(4);
    Model.findFullPlan(planId, (err, res) => {
      if (err) {
        console.error('>>>>Model.findFullPlan failed', err);
      }
      // console.log('>>>>Model.findFullPlan completed', res);
      sendApi.sendPlanDayMessage(senderId, res);
    });
  } else {
    sendApi.sendMessage(senderId, `Unknown Postback called: ${type}`);
  }
};

/*
 * handleReceiveMessage - Message Event called when a message is sent to
 * your page. The 'message' object format can vary depending on the kind
 * of message that was received. Read more at: https://developers.facebook.com/
 * docs/messenger-platform/webhook-reference/message-received
 */
const handleReceiveMessage = (event) => {
  console.log('>>>>Received message event', event);

  const message = event.message;
  const senderId = event.sender.id;

  // It's good practice to send the user a read receipt so they know
  // the bot has seen the message. This can prevent a user
  // spamming the bot if the requests take some time to return.
  sendApi.sendReadReceipt(senderId);
  // Greeting Msg, Provide with 3 quick reply options
  // - Holiday Deals, all packages marked as on promote
  // - Recent Update, last updated package instance, display only when exists
  // - Chat to ABC, handover the chat thread to page inbox
  if (message.quick_reply && message.quick_reply.payload === 'new_plan') {
    // Create new travel plan
    sendApi.sendMsgCreatePlan(senderId);
  } else if (
    message.quick_reply &&
    message.quick_reply.payload === 'existing_plan'
  ) {
    // Create new travel plan
    sendApi.sendMsgAllPlan(senderId);
  } else if (
    message.quick_reply &&
    message.quick_reply.payload.startsWith('FB##')
  ) {
    const {payload} = message.quick_reply;
    const planId = payload.substring(4);
    Model.findFullPlan(planId, (err, res) => {
      if (err) {
        console.error('>>>>Model.findFullPlan failed', err);
      }
      // console.log('>>>>Model.findFullPlan completed', res);
      sendApi.sendPlanDayMessage(senderId, res);
    });
  } else if (
    message.quick_reply &&
    message.quick_reply.payload === 'get_started'
  ) {
    // Greeting and quick reply
    const filter = {
      createdBy: senderId,
      status: {$in: [InstanceStatus.INITIATED, InstanceStatus.DEPOSIT_PAID]},
    };
    Model.findPlan(filter, (err, res) => {
      if (err) {
        console.error('>>>>Model.findPlan failed', err);
      }
      console.log('>>>>Model.findPlan completed', res);
      sendApi.sendWelcomeMessage(senderId, res);
    });
  } else if (
    message.quick_reply &&
    message.quick_reply.payload === 'deposit_paid'
  ) {
    const filter = {
      createdBy: senderId,
      status: InstanceStatus.DEPOSIT_PAID,
    };
    Model.findPlan(filter, (err, res) => {
      if (err) {
        console.error('>>>>Model.findPlan failed', err);
      }
      console.log('>>>>Model.findPlan completed', res);
      sendApi.sendDepositPaidMessage(senderId, res);
    });
  } else if (
    message.quick_reply &&
    message.quick_reply.payload === 'handover_thread'
  ) {
    // Handover to page inbox
    sendApi.passThreadControl(senderId, process.env.HANDOVER_ID);
  } else if (
    message.quick_reply &&
    message.quick_reply.payload &&
    message.quick_reply.payload.startsWith('my_recent@')
  ) {
    // Show recent package instance
    const instId = message.quick_reply.payload.split('@')[1];
    Model.getInstanceByInstId(instId, (err, docs) => {
      if (err) console.log('>>>>Error.Model.getInstanceByInstId', err);
      console.log('>>>>Model.getInstanceByInstId', docs);
      const packageSummary = ObjectParser.parseTravelPackage(docs.package);
      sendApi.sendPackageInst(senderId, docs._id, packageSummary);
    });
  } else if (message.text) {
    const filter = {
      createdBy: senderId,
      status: {$in: [InstanceStatus.INITIATED, InstanceStatus.DEPOSIT_PAID]},
    };
    Model.findPlan(filter, (err, res) => {
      if (err) {
        console.error('>>>>Model.findPlan failed', err);
      }
      console.log('>>>>Model.findPlan completed', res);
      sendApi.sendWelcomeMessage(senderId, res);
    });
  } else {
    sendApi.sendMessage(senderId, 'Unknown Message');
  }
};

const handleThreadBack = (event) => {
  console.log('>>>>Received message event', event);
  const senderId = event.sender.id;
  const filter = {
    createdBy: senderId,
    status: {$in: [InstanceStatus.INITIATED, InstanceStatus.DEPOSIT_PAID]},
  };
  Model.findPlan(filter, (err, res) => {
    if (err) {
      console.error('>>>>Model.findPlan failed', err);
    }
    console.log('>>>>Model.findPlan completed', res);
    sendApi.sendWelcomeMessage(senderId, res);
  });
};

export default {
  handleReceivePostback,
  handleReceiveMessage,
  handleThreadBack,
};
