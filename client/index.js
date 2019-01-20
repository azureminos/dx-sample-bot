/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */
// eslint-disable-next-line
import React from 'react';
import ReactDOM from 'react-dom';

/* ----------  Internal Components  ---------- */
import App from './app.jsx';
import AppView from './app-view.jsx';
import Oops from './oops.jsx';

/* ----------  Stylesheets  ---------- */
import 'react-id-swiper/src/styles/css/swiper.css';
import '../public/style.css';

window.attachApp = ({viewerId, instId, packageId, socketAddress, threadType}) => {
  console.log(
    '>>>>window.attachApp()',
    {viewerId, instId, packageId, socketAddress, threadType}
  );
  const apiUri = `https://${window.location.hostname}`;
  let app;
  if (viewerId) {
    app = (
      // The main show
      <App
        viewerId={viewerId}
        instId={instId ? Number(instId) : null}
        apiUri={apiUri}
        socketAddress={socketAddress}
        threadType={threadType}
      />
    );
  } else if (packageId) {
    app = (
      // The main show
      <AppView
        packageId={Number(packageId)}
        apiUri={apiUri}
      />
    );
  } else {
    /**
     * MessengerExtensions are only available on iOS and Android,
     * so show an error page if MessengerExtensions was unable to start
     */
    app = <Oops />;
  }

  ReactDOM.render(app, document.getElementById('content'));
};
