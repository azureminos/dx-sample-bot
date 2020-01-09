// eslint-disable-next-line
import React, {createElement} from 'react';
import ReactDOM from 'react-dom';
/* ----------  Internal Components  ---------- */
import App from './app';
import Oops from './components/oops';
// Styles
import '../public/style.css';

window.attachApp = (params) => {
  console.log('>>>>window.attachApp()', params);
  const {viewerId, instId, packageId, socketAddress, threadType} = params;
  const apiUri = `https://${window.location.hostname}`;
  const windowWidth = document.getElementById('content').offsetWidth;
  let app;
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
    /**
     * MessengerExtensions are only available on iOS and Android,
     * so show an error page if MessengerExtensions was unable to start
     */
    app = <Oops />;
  }

  ReactDOM.render(app, document.getElementById('content'));
};
