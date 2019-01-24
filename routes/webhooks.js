/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

// ===== MESSENGER =============================================================
import receiveApi from '../messenger-api-helpers/receive';
import sendQuickReply from '../messenger-api-helpers/quick-reply';
import HandoverProtocol from '../messenger-api-helpers/handover-protocol';

const router = express.Router();

/**
 * This is used so that Facebook can verify that they have
 * the correct Webhook location for your app.
 *
 * The Webhook token must be set in your app's configuration page
 * as well as in your servers environment.
 */
router.get('/', (req, res) => {
  if (req.query['hub.verify_token'] === process.env.WEBHOOK_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong token');
  }
});

/**
 * Once your Webhook is verified this is where you will receive
 * all interactions from the users of you Messenger Application.
 *
 * You can subscribe to many different types of messages.
 * However for this demo we've only handled what is necessary:
 * 1. Regular messages
 * 2. Postbacks
 */
router.post('/', (req, res) => {
    /*
    You must send back a status of 200(success) within 20 seconds
    to let us know you've successfully received the callback.
    Otherwise, the request will time out.

    When a request times out from Facebook the service attempts
    to resend the message.

    This is why it is good to send a response immediately so you
    don't get duplicate messages in the event that a request takes
    awhile to process.
  */

  const data = req.body;
  console.log('Webhook POST', JSON.stringify(data));

  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach((pageEntry) => {
      if (pageEntry.messaging) {
        // Iterate over each messaging event and handle accordingly
        pageEntry.messaging.forEach((messagingEvent) => {
          console.log({messagingEvent});

          // parse sender PSID and message
          const psid = messagingEvent.sender.id;
          const message = messagingEvent.message;

          if (messagingEvent.message) {
            if (message.quick_reply && message.quick_reply.payload == 'pass_to_inbox') {
              // quick reply to pass to Page inbox was clicked
              sendQuickReply(
                psid,
                'Tap [Take From Inbox] to have the Primary Receiver take control back.',
                'Take From Inbox',
                'take_from_inbox'
              );
              HandoverProtocol.passThreadControl(psid, 266691027485519);
            } else if (messagingEvent.pass_thread_control) {
              // thread control was passed back to bot manually in Page inbox
              sendQuickReply(
                psid,
                'Tap [Pass to Inbox] to pass control to the Page Inbox.',
                'Pass to Inbox',
                'pass_to_inbox'
              );
            } else if (message && !message.is_echo) {
              // default
              sendQuickReply(
                psid,
                'Tap [Pass to Inbox] to pass control to the Page Inbox.',
                'Pass to Inbox',
                'pass_to_inbox'
              );
            } else {
              receiveApi.handleReceiveMessage(messagingEvent);
            }
          }

          if (messagingEvent.postback) {
            receiveApi.handleReceivePostback(messagingEvent);
          } else {
            console.log(
              'Webhook received unknown messagingEvent: ',
              messagingEvent
            );
          }
        });
      } else if (pageEntry.standby) {
        const psid = event.sender.id;
        const message = event.message;

        if (message && message.quick_reply && message.quick_reply.payload == 'take_from_inbox') {
          sendQuickReply(
            psid,
            'Tap [Pass to Inbox] to pass thread control to the Page Inbox.',
            'Pass to Inbox',
            'pass_to_inbox'
          );
          HandoverProtocol.takeThreadControl(psid);
        }
      } else {
        return;
      }
    });
  }

  res.sendStatus(200);
});

export default router;
