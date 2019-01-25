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
          console.log('Message from main thread', messagingEvent);

          if (messagingEvent.message) {
            // hande new message from customer
            receiveApi.handleReceiveMessage(messagingEvent);
          } else if (messagingEvent.pass_thread_control) {
            // thread is in control by customer support
            receiveApi.handleThreadback(messagingEvent);
          } else if (messagingEvent.postback) {
            // hande postback message from customer
            receiveApi.handleReceivePostback(messagingEvent);
          } else {
            console.log(
              'Webhook received unknown messagingEvent: ',
              messagingEvent
            );
          }
        });
      } else if (pageEntry.standby) {
        // customer support needs to manualy send the thread back to bot.
        console.log('Message from standby thread', pageEntry.standby);
        /*const psid = event.sender.id;
        const message = event.message;

        if (message && message.quick_reply && message.quick_reply.payload == 'take_from_inbox') {
          sendQuickReply(
            psid,
            'Tap [Pass to Inbox] to pass thread control to the Page Inbox.',
            'Pass to Inbox',
            'pass_to_inbox'
          );
          HandoverProtocol.takeThreadControl(psid);
        }*/
      } else {
        return;
      }
    });
  }

  res.sendStatus(200);
});

export default router;
