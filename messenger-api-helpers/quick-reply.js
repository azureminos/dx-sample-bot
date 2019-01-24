// /utils/quick-reply.js //
'use strict';

// import API helper
import api from './dx-api';

// Send a quick reply message
const sendQuickReply = (psid, text, title, postbackPayload) => {
  console.log('SENDING QUICK REPLY');
  const payload = {};
  payload.recipient = {
    id: psid,
  };

  payload.message = {
    text: text,
    quick_replies: [{
        content_type: 'text',
        title: title,
        payload: postbackPayload,
    }],
  };

  api.call('/messages', payload, () => {});
};

// export the sendQuickReply function so it can be used elsewhere
export default sendQuickReply;
