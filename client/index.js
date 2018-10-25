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
import App2 from './app2.jsx';
import Oops from './oops.jsx';

/* ----------  Stylesheets  ---------- */

import 'weui';
import 'react-weui/build/packages/react-weui.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../public/style.css';

/*
 * Function for attaching the application when MessengerExtensions has loaded
 */
window.attachApp2 = (viewerId, listId, promoId, socketAddress, threadType) => {
  console.log('>>>>window.attachApp2',
    {viewerId:viewerId, listId:listId, promoId:promoId, socketAddress:socketAddress, threadType:threadType});

  const apiUri = `https://${window.location.hostname}`;
  let app;
  if (viewerId) {
    app = (
      // The main show
      <App
        viewerId={viewerId}
        listId={listId}
        promoId={promoId}
        apiUri={apiUri}
        socketAddress={socketAddress}
        threadType={threadType}
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

window.attachApp = (viewerId, instId, socketAddress, threadType) => {
  console.log('>>>>window.attachApp', {viewerId:viewerId, instId:instId, socketAddress:socketAddress, threadType:threadType});
  instId = instId?Number(instId):null;
  console.log('>>>>instId after re-format', instId);

  const apiUri = `https://${window.location.hostname}`;
  let app;
  if (viewerId) {
    app = (
      // The main show
      <App2
        viewerId={viewerId}
        instId={instId}
        apiUri={apiUri}
        socketAddress={socketAddress}
        threadType={threadType}
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
