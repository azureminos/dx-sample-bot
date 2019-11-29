/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */

// ===== MODULES ===============================================================
import request from 'request';

const fakeUsers = [
  {
    fb_id: '1',
    name: 'Ludwig Wang',
  },
  {
    fb_id: '2',
    name: 'Wolfgang Chang',
  },
  {
    fb_id: '3',
    name: 'Gabriel Dang',
  },
  {
    fb_id: '4',
    name: 'Giuseppe Tang',
  },
];

const fakeGetDetails = (userId, callback) => {
  console.log('DEMO DETAILS');
  const user = fakeUsers.find((fakeUser) => fakeUser.fb_id === userId);
  callback(
    null,
    {
      statusCode: 200,
      ok: true,
    },
    user
  );
};

const getDetailsFromFacebook = (userId, callback) => {
  request(
    {
      method: 'GET',
      url: `https://graph.facebook.com/${userId}`,
      json: true,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        // facebook requires the qs in the format
        // fields=a,b,c not fields=[a,b,c]
        fields: 'id, name, picture, email',
      },
    },
    callback
  );
};

export default {
  getDetails: process.env.DEMO ? fakeGetDetails : getDetailsFromFacebook,
};
