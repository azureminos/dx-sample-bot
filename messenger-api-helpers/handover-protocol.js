// /utils/handover-protocol.js //

'use strict';

// import API helper
import api from './dx-api';

const passThreadControl = (userPsid, targetAppId) => {
  console.log('PASSING THREAD CONTROL');
  const payload = {
    recipient: {
      id: userPsid,
    },
    target_app_id: targetAppId,
  };

  api.call('/pass_thread_control', payload, () => {});
};

const takeThreadControl = (userPsid) => {
  console.log('TAKING THREAD CONTROL');
  const payload = {
    recipient: {
      id: userPsid,
    },
  };

  api.call('/take_thread_control', payload, () => {});
};

export default {
  passThreadControl,
  takeThreadControl,
};
