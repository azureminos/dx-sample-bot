// eslint-disable-next-line
import React, {createElement} from 'react';
import ReactDOM from 'react-dom';
/* ----------  Internal Components  ---------- */
import App from './app';
import Oops from './components/oops';

window.attachApp = (params) => {
  console.log('>>>>window.attachApp()', params);
  /* document.getElementById(
    'message'
  ).innerHTML = `>>>>window.attachApp() >>${JSON.stringify(params)}`;*/
  const {viewerId, instId, packageId, socketAddress, threadType} = params;
  /* document.getElementById('message').innerHTML = `>>>>window.attachApp() >> ${
    window && window.location ? window.location.hostname : 'Empty Host'
  }, window.location: ${JSON.stringify(window.location)}`;*/
  const apiUri = `https://${window.location.hostname}`;
  const windowWidth = document.getElementById('content').offsetWidth;
  document.getElementById(
    'message'
  ).innerHTML = `>>>>window.attachApp() >> viewerId: ${viewerId}, instId: ${instId}, packageId: ${packageId}, socketAddress: ${socketAddress}, apiUri: ${apiUri}, threadType: ${threadType}, windowWidth: ${windowWidth}`;
  /* let app;
  if (viewerId) {
    app = (
      // The main show
      <App
        viewerId={viewerId}
        instId={instId}
        packageId={packageId}
        apiUri={apiUri}
        socketAddress={socketAddress}
        threadType={threadType}
        windowWidth={windowWidth}
      />
    );
  } else {
    app = <Oops />;
  }

  ReactDOM.render(app, document.getElementById('content'));*/
};
