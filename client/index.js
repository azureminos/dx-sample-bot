// eslint-disable-next-line
import React, {createElement} from 'react';
import ReactDOM from 'react-dom';
/* ----------  Internal Components  ---------- */
import App from './app';
import Oops from './components/oops';

window.attachApp = (params) => {
  console.log('>>>>window.attachApp()', params);
  const {viewerId, planId, socketAddress, threadType} = params;
  const apiUri = `https://${window.location.hostname}`;
  const windowWidth = document.getElementById('content').offsetWidth;
  let app;
  if (viewerId) {
    app = (
      // The main show
      <App
        viewerId={viewerId}
        planId={planId}
        apiUri={apiUri}
        socketAddress={socketAddress}
        threadType={threadType}
        windowWidth={windowWidth}
      />
    );
  } else {
    app = <Oops />;
  }

  ReactDOM.render(app, document.getElementById('content'));
};
