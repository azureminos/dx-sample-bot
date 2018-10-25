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
import ListNotFound from './list_not_found.jsx';
import LoadingScreen from './loading_screen.jsx';
import Title from './title.jsx';
import Updating from './updating.jsx';
import Viewers from './viewers.jsx';
import CenterSlider from './slider.jsx';
import PackageSummary from './package-summary.jsx';

let socket;

/* =============================================
   =            React Application              =
   ============================================= */

export default class App2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      packageInst: null,
      packages: [],
      ownerId: null,
      cityAttractions: null,
      isCustomisable: false,
      updating: false,
      users: [],
    };

    /*--------------------Dummy Data---------------*/
    /*this.state.ownerId = 1;
    this.state.isCustomisable = false;
    this.state.cityAttractions = {
      Shanghai: [
        {
          "id": 1,
          "name": "The Bund",
          "cityId": 1,
          "cityName": "Shanghai",
          "desc": "The Bund",
          "alias": "The Bund",
          "tag": "The Bund",
          "imageUrl": "media/attraction_1.png",
          "isLiked": true,
        },
        {
          "id": 3,
          "name": "Lu Jia Zui",
          "cityId": 1,
          "cityName": "Shanghai",
          "desc": "Lu Jia Zui",
          "alias": "Lu Jia Zui",
          "tag": "Lu Jia Zui",
          "imageUrl": "media/attraction_1.png",
          "isLiked": true,
        },
        {
          "id": 2,
          "name": "Xu Jia Hui",
          "cityId": 1,
          "cityName": "Shanghai",
          "desc": "Xu Jia Hui",
          "alias": "Xu Jia Hui",
          "tag": "Xu Jia Hui",
          "imageUrl": "media/attraction_2.png",
          "isLiked": false,
        },
      ],
      Beijing: [
        {
          "id": 4,
          "name": "Tian An Men",
          "cityId": 2,
          "cityName": "Beijing",
          "desc": "Tian An Men",
          "alias": "Tian An Men",
          "tag": "Tian An Men",
          "imageUrl": "media/attraction_2.png",
          "isLiked": false,
        },
        {
          "id": 5,
          "name": "The Great Wall",
          "cityId": 2,
          "cityName": "Beijing",
          "desc": "The Great Wall",
          "alias": "The Great Wall",
          "tag": "The Great Wall",
          "imageUrl": "media/attraction_1.png",
          "isLiked": true,
        },
        {
          "id": 6,
          "name": "The Forbidden Palace",
          "cityId": 2,
          "cityName": "Beijing",
          "desc": "The Forbidden Palace",
          "alias": "The Forbidden Palace",
          "tag": "The Forbidden Palace",
          "imageUrl": "media/attraction_2.png",
          "isLiked": false,
        },
      ],
    };
    this.state.users = [
      {fbId: 1, online: true}
    ];
    this.state.packageInst =
    {
        "id": 37,
        "startDate": null,
        "isPremium": false,
        "fee": null,
        "name": "Another China 2 Days",
        "desc": "Another China 2 Days",
        "days": 2,
        "imageUrl": "media/package_1.png",
        "items": [
            {
                "id": 69,
                "dayNo": 1,
                "order": 1,
                "createdBy": null,
                "updatedBy": null,
                "desc": "Day time in the Bund",
                "attractionName": "The Bund",
                "attractionDesc": "The Bund",
                "imageUrl": "media/attraction_1.png",
                "city": "Shanghai"
            },
            {
                "id": 70,
                "dayNo": 1,
                "order": 2,
                "createdBy": null,
                "updatedBy": null,
                "desc": "Night time in Lu Jia Zui",
                "attractionName": "Lu Jia Zui",
                "attractionDesc": "Lu Jia Zui",
                "imageUrl": "media/attraction_1.png",
                "city": "Shanghai"
            },
            {
                "id": 71,
                "dayNo": 2,
                "order": 1,
                "createdBy": null,
                "updatedBy": null,
                "desc": "Morning to the Great Wall",
                "attractionName": "The Great Wall",
                "attractionDesc": "The Great Wall",
                "imageUrl": "media/attraction_1.png",
                "city": "Beijing"
            },
            {
                "id": 72,
                "dayNo": 2,
                "order": 2,
                "createdBy": null,
                "updatedBy": null,
                "desc": "Afternoon go to the Forbidden Palace",
                "attractionName": "The Forbidden Palace",
                "attractionDesc": "The Forbidden Palace",
                "imageUrl": "media/attraction_2.png",
                "city": "Beijing"
            }
        ],
        "rates": [
            {
                "id": 1,
                "packageId": 2,
                "tier": 1,
                "premiumFee": "800.00",
                "minJoins": 6,
                "packageRate": "2000.00"
            },
            {
                "id": 2,
                "packageId": 2,
                "tier": 2,
                "premiumFee": "300.00",
                "minJoins": 12,
                "packageRate": "1500.00"
            }
        ]
    };
    this.state.packages = [];*/

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

    console.log('>>>>Push event['+channel+'] with message',
      {senderId: this.props.viewerId, instId: this.props.instId, ...message,}
    );
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
    console.log('>>>>Result coming back from socket [user:join]', newUser);
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

  /* =============================================
     =              React Lifecycle              =
     ============================================= */

  componentWillMount() {
    // Connect to socket.
    socket = io.connect(
      this.props.socketAddress,
      {reconnect: true, secure: true}
    );

    // Add socket event handlers.
    socket.on('init', ({packageInst, packages=[], cityAttractions, users, ownerId} = {}) => {
      console.log('>>>>Result coming back from socket [init]',
        {packageInst:packageInst, packages:packages, cityAttractions:cityAttractions, users:users, ownerId:ownerId});
      this.setState({packageInst, packages, cityAttractions, users, ownerId});
    });

    //socket.on('item:add', this.addItem);
    //socket.on('item:update', this.setItem);
    //socket.on('list:setOwnerId', this.setOwnerId);
    //socket.on('title:update', this.setDocumentTitle);
    socket.on('user:join', this.userJoin);
    //socket.on('users:setOnline', this.setOnlineUsers);

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
            console.log('>>>>calling socket [push:user:join]', self.props.viewerId);
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
  }

  render() {
    const {
      ownerId,
      packageInst,
      packages,
      cityAttractions,
      users,
      title,
      resetting,
      newItemText,
      updating,
      socketStatus,
    } = this.state;

    let page;

    if(!packageInst) {
      console.log('>>>>No package instance found, let user select a package');
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
      console.log('>>>>Package instance and user found', {props: this.props, state: this.state});
      const {apiUri, instId, viewerId, threadType} = this.props;
      page = (
        <section>
        <Tab type="navbar">
          <NavBarItem label="Summary">
            <section id='package'>
              <PackageSummary
                packageInst={packageInst}
                apiUri={apiUri}
                cityAttractions={cityAttractions}
              >
              </PackageSummary>
              <Updating updating={updating} />
            </section>
          </NavBarItem>
          <NavBarItem label="Itinerary">
            <p>Your Itinerary</p>
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
      <div id='app'>
        <ReactCSSTransitionGroup
          transitionName='page'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {page}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
