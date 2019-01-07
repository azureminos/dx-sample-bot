/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */

// ===== MESSENGER =============================================================
import api from './api';

/* ----------  Globals  ---------- */
const {APP_URL} = process.env;

/* ----------  Functions  ---------- */

/**
 * Adds the home url to the Messenger App's whitelist.
 *
 * This is required to use Messenger Extensions which
 * this demo uses to get UserId's from a Messenger WebView.
 *
 * @returns {undefined}
 */
const setHomeUrl = () => {
  api.callMessengerProfileAPI(
    {
      home_url: {
        url: [APP_URL]+'instance/home',
        webview_height_ratio: 'tall',
        webview_share_button: 'hide',
        in_test: true,
      },
    }
  );
};

export default {
  setHomeUrl,
};
