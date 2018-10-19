/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import io from 'socket.io-client';
import React, {createElement} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Tab, NavBarItem} from 'react-weui';


// ===== COMPONENTS ============================================================
import Invite from './invite.jsx';
import Item from './item.jsx';
import ListNotFound from './list_not_found.jsx';
import LoadingScreen from './loading_screen.jsx';
import NewItem from './new_item.jsx';
import Title from './title.jsx';
import Updating from './updating.jsx';
import Viewers from './viewers.jsx';
import TourSummary from './summary.jsx';
import CenterSlider from './slider.jsx';
import PackageDetails from './package-details.jsx';

let socket;

/* =============================================
   =            React Application              =
   ============================================= */

export default class App2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      packageInst: null,
      packages: null,
      ownerId: null,
      resetting: false,
      title: this.props.title,
      updating: false,
      users: [],
    };

    /*--------------------Dummy Data---------------*/
    this.state.ownerId = 1;
    this.state.users = [
      {fbId: 1, online: true}
    ];
    this.state.title = 'Dummy';
    this.state.packageInst = {
      "id": 13,
      "startDate": null,
      "isPremium": false,
      "fee": null,
      "name": "China 2 Days",
      "desc": "China 2 Days",
      "days": 2,
      "imageUrl": "media/package_2.png",
      "items": [
        {
          "id": 21,
          "dayNo": 1,
          "order": 1,
          "createdBy": 1,
          "updatedBy": 1,
          "desc": "Day time in attr 4",
          "attractionName": "Attr 4",
          "attractionDesc": "Attr 4",
          "imageUrl": "media/attraction_2.png",
          "city": "Dummy 2"
        },
        {
          "id": 22,
          "dayNo": 2,
          "order": 1,
          "createdBy": 1,
          "updatedBy": 1,
          "desc": "Day time in attr 5",
          "attractionName": "Attr 5",
          "attractionDesc": "Attr 5",
          "imageUrl": "media/attraction_1.png",
          "city": "Dummy 2"
        }
      ],
      "rates": [
        {
          "id": 3,
          "packageId": 1,
          "tier": 1,
          "premiumFee": "500.00",
          "minJoins": 10,
          "packageRate": "1800.00"
        }
      ],
      "participants": [
        {
          "userId": 1,
          "isOwner": true
        }
      ]
    };
    this.state.packages = [];

    /*this.state.packageInst = null;
    this.state.packages = [
        {
            "id": 2,
            "name": "Another China 2 Days",
            "desc": "Another China 2 Days",
            "days": 2,
            "isPromoted": true,
            "isActive": true,
            "imageUrl": "media/package_1.png"
        },
        {
            "id": 1,
            "name": "China 2 Days",
            "desc": "China 2 Days",
            "days": 2,
            "isPromoted": true,
            "isActive": true,
            "imageUrl": "media/package_2.png"
        }
    ];*/
  }

  static propTypes = {
    apiUri: React.PropTypes.string.isRequired,
    instId: React.PropTypes.number.isRequired,
    socketAddress: React.PropTypes.string.isRequired,
    viewerId: React.PropTypes.number.isRequired,
    threadType: React.PropTypes.string.isRequired,
  }

  /* =============================================
     =               Helper Methods              =
     ============================================= */

  /* ----------  Communicate with Server  ---------- */

  /*
   * Push a message to socket server
   * To keep things clear, we're distinguishing push events by automatically
   * prepending 'push:' to the channel name
   *
   * Returned responses have no prefix,
   * and read the same in the rest of the code
   */
  pushToRemote(channel, message) {
    this.setState({updating: true}); // Set the updating spinner

    socket.emit(
      `push:${channel}`,
      {
        senderId: this.props.viewerId,
        instId: this.props.instId,
        ...message,
      },
      (status) => {
        // Finished successfully with a special 'ok' message from socket server
        if (status !== 'ok') {
          console.error(
            `Problem pushing to ${channel}`,
            JSON.stringify(message)
          );
        }

        this.setState({
          socketStatus: status,
          updating: false, // Turn spinner off
        });
      }
    );
  }

  /* ----------  Update Document Attributes  ---------- */

  setDocumentTitle(title = 'Shopping List') {
    console.log('Updating document title (above page):', title);
    document.title = title;
  }

  /* =============================================
     =           State & Event Handlers          =
     ============================================= */

  /* ----------  List  ---------- */

  // For the initial data fetch
  setOwnerId(ownerId) {
    console.log('Set owner ID:', ownerId);
    this.setState({ownerId});
  }

  setTitleText(title) {
    console.log('Push title to remote:', title);
    this.setState({title});
    this.setDocumentTitle(title);
    this.pushToRemote('title:update', {title});
  }

  /* ----------  Users  ---------- */

  // Socket Event Handler for Set Online Users event.
  setOnlineUsers(onlineUserFbIds = []) {
    const users = this.state.users.map((user) => {
      const isOnline =
        onlineUserFbIds.find((onlineUserFbId) => onlineUserFbId === user.fbId);

      return Object.assign({}, user, {online: isOnline});
    });

    this.setState({users});
  }

  // Socket Event Handler for User Join event.
  userJoin(newUser) {
    const oldUsers = this.state.users.slice();
    const existing = oldUsers.find((user) => user.fbId === newUser.fbId);

    let users;
    if (existing) {
      users = oldUsers.map((user) =>
        (user.fbId === newUser.fbId)
        ? newUser
        : user
      );
    } else {
      oldUsers.push(newUser);
      users = oldUsers;
    }

    this.setState({users});
  }

  /* ----------  Items  ---------- */

  addItem(item) {
    this.setState({items: [...this.state.items, item]});
  }

  pushUpdatedItem(itemId, name, completerFbId) {
    this.pushToRemote('item:update', {id: itemId, name, completerFbId});
  }

  setItem({id, name, completerFbId}) {
    const items = this.state.items.map((item) =>
      (item.id === id)
        ? Object.assign({}, item, {id: id, name, completerFbId})
        : item
    );

    this.setState({items});
  }

  /* ----------  New Item Field  ---------- */

  setNewItemText(newText) {
    console.log('Set new item text:', newText);
    this.setState({newItemText: newText});
  }

  // Turn new item text into an actual list item
  addNewItem() {
    const {newItemText: name} = this.state;

    this.resetNewItem();
    this.pushToRemote('item:add', {name});
  }

  resetNewItem() {
    this.setState({resetting: true});

    setTimeout(() => {
      this.setState({newItemText: '', resetting: false});
    }, 600);
  }

  /* =============================================
     =              React Lifecycle              =
     ============================================= */

  /*componentWillMount() {
    // Connect to socket.
    socket = io.connect(
      this.props.socketAddress,
      {reconnect: true, secure: true}
    );

    // Add socket event handlers.
    socket.on('init', ({users, items, ownerId, title} = {}) => {
      this.setState({users, items, ownerId, title});
    });

    socket.on('item:add', this.addItem);
    socket.on('item:update', this.setItem);
    socket.on('list:setOwnerId', this.setOwnerId);
    socket.on('title:update', this.setDocumentTitle);
    socket.on('user:join', this.userJoin);
    socket.on('users:setOnline', this.setOnlineUsers);

    const self = this;
    // Check for permission, ask if there is none
    window.MessengerExtensions.getGrantedPermissions(function(response) {
      // check if permission exists
      const permissions = response.permissions;
      if (permissions.indexOf('user_profile') > -1) {
        self.pushToRemote('user:join', {id: self.props.viewerId});
      } else {
        window.MessengerExtensions.askPermission(function(response) {
          const isGranted = response.isGranted;
          if (isGranted) {
            self.pushToRemote('user:join', {id: self.props.viewerId});
          } else {
            window.MessengerExtensions.requestCloseBrowser(null, null);
          }
        }, function(errorCode, errorMessage) {
          console.error({errorCode, errorMessage});
          window.MessengerExtensions.requestCloseBrowser(null, null);
        }, 'user_profile');
      }
    }, function(errorCode, errorMessage) {
      console.error({errorCode, errorMessage});
      window.MessengerExtensions.requestCloseBrowser(null, null);
    });
  }*/

  render() {
    const {
      ownerId,
      packageInst,
      packages,
      users,
      title,
      resetting,
      newItemText,
      updating,
      socketStatus,
    } = this.state;

    let page;

    if(!packageInst) {
      const {apiUri, instId, viewerId, threadType} = this.props;
      page = (
        <section>
          <CenterSlider
            items={packages}
            buttonName="Book Now"
            apiUri={apiUri}
          >
          </CenterSlider>
        </section>
      );
    } else if (users.length > 0) {
      // Skip and show loading spinner if we don't have data yet
      /* ----------  Setup Sections (anything dynamic or repeated) ---------- */
      const {apiUri, instId, viewerId, threadType} = this.props;
      page = (
        <section>
        <Tab type="navbar">
          <NavBarItem label="Package Details">
            <section id='package'>
              <PackageDetails
                packageInst={packageInst}
                apiUri={apiUri}
              >
              </PackageDetails>
            </section>
          </NavBarItem>
          <NavBarItem label="Package Summary">
            <p>Tab Summary</p>
          </NavBarItem>
        </Tab>
        </section>
      );

    } else if (socketStatus === 'noList') {
      // We were unable to find a matching list in our system.
      page = <ListNotFound/>;
    } else {
      // Show a loading screen until app is ready
      page = <LoadingScreen key='load' />;
    }

    /* ----------  Animated Wrapper  ---------- */

    return (
      <Page>
        <div id='app'>
          <ReactCSSTransitionGroup
            transitionName='page'
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
            {page}
          </ReactCSSTransitionGroup>
        </div>
      </Page>
    );
  }
}
