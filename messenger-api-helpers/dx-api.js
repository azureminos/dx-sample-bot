/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';
import request from 'request';

const call = (path, payload, callback) => {
  const accessToken = process.env.PAGE_ACCESS_TOKEN;
  const graphUrl = 'https://graph.facebook.com/me';

  if (!path) {
    console.error('No endpoint specified on Messenger send!');
    return;
  } else if (!accessToken || !graphUrl) {
    console.error('No Page access token or graph API url configured!');
    return;
  }

  request({
    uri: graphUrl + path,
    qs: {access_token: accessToken},
    method: 'POST',
    json: payload,
  }, (error, response, body) => {
    console.log(body);
    if (!error && response.statusCode === 200) {
      console.log('Message sent succesfully');
    } else {
      console.error('Error: ' + error);
    }
    callback(body);
  });
};

export default {
  call,
};
