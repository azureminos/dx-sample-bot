/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ==== MODULES ==========================================
import _ from 'lodash';
import Moment from 'moment';
import io from 'socket.io-client';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {CSSTransitionGroup} from 'react-transition-group';

// ==== COMPONENTS ========================================
// ==== HELPERS =======================================
import Helper from '../lib/helper';
import PackageHelper from '../lib/package-helper';
import CONSTANTS from '../lib/constants';

// ==== CSS ==============================================
import 'swiper/css/swiper.css';
import '../public/style.css';

// Variables
const styles = (theme) => ({});
const {Modal, Global, Instance, SocketChannel} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const SocketAction = SocketChannel.Action;

let socket;

/* ==============================
   = React Application          =
   ============================== */
class App extends React.Component {
  constructor(props) {
    super(props);
    // Register event handler
    this.pushToRemote = this.pushToRemote.bind(this);
    this.init = this.init.bind(this);
    this.register = this.register.bind(this);
    this.setOnlineUsers = this.setOnlineUsers.bind(this);

    this.state = {
      updating: false,
      user: null,
      socketStatus: '',
      plan: null,
      reference: {},
    };
  }

  /* ==============================
     = Helper Methods             =
     ============================== */

  /* ==============================
     = Socket Methods             =
     ============================== */
  pushToRemote(channel, message) {
    console.log(`>>>>Push event[${channel}] with message`, message);
    this.setState({updating: true}); // Set the updating spinner
    socket.emit(`push:${channel}`, message, (status) => {
      // Finished successfully with a special 'ok' message from socket server
      if (status !== 'ok') {
        console.error(`Problem pushing to ${channel}`, JSON.stringify(message));
      }
    });
  }

  /* ==============================
     = State & Event Handlers     =
     ============================== */
  // ----------  App  ----------
  register() {
    const {viewerId, instId} = this.props;
    console.log('>>>>MobileApp.register', {viewerId, instId});
    if (instId) {
      const params = {
        senderId: viewerId,
        instId: instId,
      };
      this.pushToRemote('register', params);
    }
  }
  /* ----------  Package Instance ------- */
  init(results) {
    console.log('>>>>Result from socket [init]', results);
  }
  // ----------  Users  ----------
  setOnlineUsers(onlineUserFbIds = []) {
    const users = this.state.users.map((user) => {
      const isOnline = onlineUserFbIds.find(
        (onlineUserFbId) => onlineUserFbId === user.fbId
      );
      return Object.assign({}, user, {online: isOnline});
    });
    this.setState({users});
  }
  /* ==============================
     = React Lifecycle            =
     ============================== */
  componentDidMount() {
    // Connect to socket.
    console.log('>>>>Socket connect to', this.props.socketAddress);
    socket = io.connect(this.props.socketAddress, {
      reconnect: true,
      secure: true,
    });

    // Add socket event handlers.
    socket.on('disconnect', () => {
      console.log('>>>>Socket.disconnect');
    });
    socket.on('reconnect', () => {
      console.log('>>>>Socket.reconnect');
    });
    socket.on('connect', this.register);
    socket.on('init', this.init);

    const {viewerId, planId} = this.props;
    const handleMount = (vid, pid) => {
      if (vid && !pid) {
        if (pid) {
          console.log('>>>>Page[Main], Load All Package');
        } else {
          console.log('>>>>New => Page[Select Date], ID => Page[Display Trip]');
        }
        this.pushToRemote('plan:view', {
          senderId: vid,
          planId: pid,
        });
      } else {
        console.log('>>>>NO viewerId');
      }
    };
    handleMount(viewerId, planId);
    // Check for permission, ask if there is none
    /* window.MessengerExtensions.getGrantedPermissions(
      function(response) {
        // check if permission exists
        const permissions = response.permissions;
        if (permissions.indexOf('user_profile') > -1) {
          handleMount(viewerId, instId, packageId);
        } else {
          window.MessengerExtensions.askPermission(
            function(response) {
              if (response.isGranted) {
                handleMount(viewerId, instId, packageId);
              } else {
                document.getElementById('message').innerHTML = `${
                  document.getElementById('message').innerHTML
                }>>>>getPermissions isGranted: false`;
                window.MessengerExtensions.requestCloseBrowser(null, null);
              }
            },
            function(errorCode, errorMessage) {
              console.error({errorCode, errorMessage});
              document.getElementById('message').innerHTML = `${
                document.getElementById('message').innerHTML
              }>>>>getPermissions Failed 1: ${errorCode} : ${errorMessage}`;
              // window.MessengerExtensions.requestCloseBrowser(null, null);
            },
            'user_profile'
          );
        }
      },
      function(errorCode, errorMessage) {
        console.error('>>>>getPermissions Failed 0', {errorCode, errorMessage});
        document.getElementById('message').innerHTML = `${
          document.getElementById('message').innerHTML
        }>>>>getPermissions Failed 0: ${errorCode} : ${errorMessage}`;
        // window.MessengerExtensions.requestCloseBrowser(null, null);
      }
    );*/
  }

  render() {
    // document.title = packageSummary.name;
    // Local Variables
    console.log('>>>>MobileApp.render', this.state);
    const {apiUri, viewerId, windowWidth} = this.props;
    // Sub Components
    let page = <div>Loading...</div>;
    page = <div>Loading...</div>;
    /* ----------  Animated Wrapper  ---------- */
    return (
      <div id='app'>
        <CSSTransitionGroup
          transitionName='page'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {page}
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(App);
