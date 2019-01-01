/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ==== MODULES ==========================================
import io from 'socket.io-client';
import React, {createElement} from 'react';
import PropTypes from 'prop-types';
import {CSSTransitionGroup} from 'react-transition-group';
import {Paper, Typography} from '@material-ui/core';

// ==== COMPONENTS ========================================
import Invite from './invite.jsx';
import ListNotFound from './list_not_found.jsx';
import LoadingScreen from './loading_screen.jsx';
import Updating from './updating.jsx';
import FixedTab from './components/fixed-tab';
import PackageAttraction from './package-attraction';
import PackageItinerary from './package-itinerary';
import PackageSelector from './package-selector.jsx';
import _ from 'lodash';

let socket;

/* ==============================
   = React Application          =
   ============================== */

export default class App2 extends React.Component {
  constructor(props) {
    super(props);

    this.preInit = this.preInit.bind(this);
    this.init = this.init.bind(this);
    this.pushCreateInstPackage = this.pushCreateInstPackage.bind(this);
    this.setLikedAttractions = this.setLikedAttractions.bind(this);
    this.setSelectedHotel = this.setSelectedHotel.bind(this);
    this.updateItinerary = this.updateItinerary.bind(this);

    this.state = {
      packages: [],
      users: [],
      instPackage: null,
      ownerId: null,
      cityAttractions: null,
      cityHotels: null,
      cities: null,
      isCustomisable: false,
      updating: false,
    };
  }

  static propTypes = {
    apiUri: PropTypes.string.isRequired,
    instId: PropTypes.number.isRequired,
    socketAddress: PropTypes.string.isRequired,
    viewerId: PropTypes.number.isRequired,
    threadType: PropTypes.string.isRequired,
  }

  /* ==============================
     = Helper Methods             =
     ============================== */

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

  /* ==============================
     = State & Event Handlers     =
     ============================== */

  /* ----------  Package  ------- */
  preInit({packages}) {
    console.log('>>>>Result coming back from socket [pre-init]', packages);
    this.setState({packages});
  }

  pushCreateInstPackage(packageId) {
    const ownerId = this.props.viewerId;
    console.log('>>>>Send event to create package instance with input',
      {packageId: packageId, ownerId: ownerId});
    //this.pushToRemote('instPackage:create', {packageId, ownerId});
  }

  /* ----------  Package Instance ------- */
  init({instPackage, cityAttractions, cityHotels, cities, users, ownerId}) {
    console.log('>>>>Result coming back from socket [init]',
      {
        instPackage: instPackage,
        cityAttractions: cityAttractions,
        cityHotels: cityHotels,
        cities: cities,
        users: users,
        ownerId: ownerId,
      }
    );

    const u = _.filter(users, (user) => {return user.fbId == ownerId;});
    console.log('>>>>Matched User['+ownerId+']', u);
    if (u && u[0].likedAttractions) {
      const liked = u[0].likedAttractions.split(',');
      _.forEach(_.values(cityAttractions), (attractions) => {
        _.forEach(attractions, (a) => {
          a.isLiked = !!_.find(liked, (likedId) => { return likedId == a.id;});
        });
      });
    } else {
      _.forEach(_.values(cityAttractions), (attractions) => {
        _.forEach(attractions, (a) => {
          a.isLiked = !!_.find(instPackage.items, (item) => { return item.attractionId == a.id;});
        });
      });
    }
    console.log('>>>>After update liked attractions', cityAttractions);

    _.forEach(cityHotels, (cHotels) => {
      _.forEach(cHotels, (hotel) => {
        if (hotel.id == 1) {
          hotel.imageUrl = 'media/Hotel_Beijing_BeijingHotel.jpg';
        } else if (hotel.id == 2) {
          hotel.imageUrl = 'media/Hotel_Beijing_BeijingHolidayInn.jpg';
        } else if (hotel.id == 3) {
          hotel.imageUrl = 'media/Hotel_Shanghai_PenisulaShanghai.jpg';
        } else if (hotel.id == 4) {
          hotel.imageUrl = 'media/Hotel_Shanghai_ShanghaiHotel.jpg';
        }
      });
    });

    this.setState({instPackage, packages: [], cityAttractions, cityHotels, cities, users, ownerId});
  }

  /* ----------  Package Instance Items------- */
  updateItinerary(attraction, action) {
    const inst = this.state.instPackage;
    if (action == 'DELETE') {
      console.log('>>>>updateItinerary.delete', attraction);
      inst.items = _.filter(inst.items, (item) => {
        return item.attractionId !== attraction.id;
      });
      console.log('>>>>updateItinerary.delete - result', inst.items);
    } else if (action == 'ADD') {
      if (!_.find(inst.items, (i) => {return i.attractionId == attraction.id;})) {
        console.log('>>>>updateItinerary.add', attraction);
        let firstMatch = -1;
        _.forEach(inst.items, (item, idx) => {
          if (item.city == attraction.cityName) {
            console.log('>>>>updateItinerary.add - find city match', item);
            const nearbyAttractions = item.nearbyAttractions || '';
            firstMatch = (firstMatch == -1) ? idx : firstMatch;
            if (!!_.find(nearbyAttractions.split(','), (nba) => {return nba == attraction.id;})) {
              console.log('>>>>updateItinerary.add - find attraction nearby', item);
              // Insert next to the item
              const iNew = {
                attractionId: attraction.id,
                city: attraction.cityName,
                dayNo: item.dayNo,
                daySeq: item.daySeq,
                description: attraction.description,
                id: -1,
                imageUrl: attraction.imageUrl,
                name: attraction.name,
              };
              if (firstMatch == inst.items.length) {
                inst.items = _.concat(_.slice(inst.items, 0, firstMatch + 1), iNew);
              } else {
                inst.items = _.concat(_.slice(inst.items, 0, firstMatch + 1), iNew, _.slice(inst.items, firstMatch + 1, inst.items.length));
              }
              firstMatch = -1;
              return false;
            }
          }
        });

        if (firstMatch !== -1) {
          // Insert next to the first matchitem
          const iNew = {
            attractionId: attraction.id,
            city: attraction.cityName,
            dayNo: inst.items[firstMatch].dayNo,
            daySeq: inst.items[firstMatch].daySeq,
            description: attraction.description,
            id: -1,
            imageUrl: attraction.imageUrl,
            name: attraction.name,
          };
          if (firstMatch == inst.items.length) {
            inst.items = _.concat(_.slice(inst.items, 0, firstMatch + 1), iNew);
          } else {
            inst.items = _.concat(_.slice(inst.items, 0, firstMatch + 1), iNew, _.slice(inst.items, firstMatch + 1, inst.items.length));
          }
        }
      } else {
        console.log('>>>>updateItinerary.add - bypass item already in the itinerary', attraction);
      }
    }
  }
  /* ----------  Attractions  ---------- */
  setLikedAttractions(attraction) {
    const cityAttractions = this.state.cityAttractions;
    const instId = this.state.instPackage.id;
    const likedAttractions = [];

    console.log('>>>>setLikedAttractions['+attraction.id+'] of Inst['+instId+']', {attraction: attraction, cityAttractions: cityAttractions});
    _.forEach(_.values(cityAttractions), (attractions) => {
      _.forEach(attractions, (a) => {
        if (a.id == attraction.id) {
          a.isLiked = !a.isLiked;
          attraction.isLiked = a.isLiked;
        }

        if (a.isLiked) {
          likedAttractions.push(a.id);
        }
      });
    });

    const params = {
      instId: instId,
      likedAttractions: likedAttractions.toString(),
      action: attraction.isLiked ? 'ADD' : 'DELETE',
      actionItemId: attraction.id,
    };
    console.log('>>>>Send event to update user liked attraction', params);
    this.pushToRemote('likedAttractions:update', params);

    // action is delete, find the item in package instance and delete
    // action is add, find the nearby item and add next to it
    this.updateItinerary(attraction, params.action);
  }

  /* ---------- Hotels ---------- */
  setSelectedHotel(hotel) {
    const cityHotels = this.state.cityHotels;
    const instId = this.state.instPackage.id;
    console.log('>>>>setSelectedHotel of Inst['+instId+']', {cityHotels: cityHotels, hotel: hotel});
  }

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
        onlineUserFbIds.find((onlineUserFbId) => onlineUserFbId == user.fbId);

      return Object.assign({}, user, {online: isOnline});
    });

    this.setState({users});
  }

  // Socket Event Handler for User Join event.
  userJoin(newUser) {
    console.log('>>>>Result coming back from socket [user:join]', newUser);
    const oldUsers = this.state.users.slice();
    const existing = oldUsers.find((user) => user.fbId == newUser.fbId);

    let users;
    if (existing) {
      users = oldUsers.map((user) =>
        (user.fbId == newUser.fbId) ? newUser : user);
    } else {
      oldUsers.push(newUser);
      users = oldUsers;
    }

    this.setState({users});
  }

  /* ==============================
     = React Lifecycle            =
     ============================== */

  componentWillMount() {
    // Connect to socket.
    socket = io.connect(
      this.props.socketAddress,
      {reconnect: true, secure: true}
    );

    // Add socket event handlers.
    socket.on('pre-init', this.preInit);
    socket.on('init', this.init);
    socket.on('user:join', this.userJoin);

    //socket.on('item:add', this.addItem);
    //socket.on('item:update', this.setItem);
    //socket.on('list:setOwnerId', this.setOwnerId);
    //socket.on('title:update', this.setDocumentTitle);
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
      instPackage,
      packages,
      cityAttractions,
      cityHotels,
      cities,
      users,
      updating,
      socketStatus,
    } = this.state;

    let page;

    if (!instPackage) {
      console.log('>>>>No package instance found, let user select a package');
      const {apiUri} = this.props;
      if (packages && packages.length > 0) {
        page = (
          <section id='package-selector'>
            <PackageSelector
              packages={packages}
              bookPackage={this.pushCreateInstPackage}
              apiUri={apiUri}
            />
          </section>
        );
      }
    } else if (users.length > 0) {
      // Skip and show loading spinner if we don't have data yet
      /* -------  Setup Sections (anything dynamic or repeated) ------- */
      console.log('>>>>Package instance and user found',
        {props: this.props, state: this.state});
      const {apiUri, viewerId, threadType} = this.props;

      // Setup module "Invite"
      let invite;
      const isOwner = viewerId == ownerId;
      if (isOwner || threadType !== 'USER_TO_PAGE') {
        // only owners are able to share their lists and other
        // participants are able to post back to groups.
        let sharingMode;
        let buttonText;

        if (threadType == 'USER_TO_PAGE') {
          sharingMode = 'broadcast';
          buttonText = 'Invite';
        } else {
          sharingMode = 'current_thread';
          buttonText = 'Send';
        }

        invite = (
          <Invite
            instPackage={instPackage}
            apiUri={apiUri}
            sharingMode={sharingMode}
            buttonText={buttonText}
          />
        );
      }

      const tabs = {
        Attraction: (
          <div id='package-attraction'>
            <Typography>
              <PackageAttraction
                instPackage={instPackage}
                apiUri={apiUri}
                cities={cities}
                cityAttractions={cityAttractions}
                likeAttractions={this.setLikedAttractions}
              />
              <Updating updating={updating} />
            </Typography>
            <br/>
            <br/>
          </div>
        ),
        Itinerary: (
          <div id='package-itinerary'>
            <Typography>
              <PackageItinerary
                instPackage={instPackage}
                cityAttractions={cityAttractions}
                cityHotels={cityHotels}
                apiUri={apiUri}
                selectHotel={this.setSelectedHotel}
              />
            </Typography>
            <br/>
            <br/>
          </div>
        ),
      };

      page = (
        <Paper>
          <FixedTab tabs={tabs} isOwner={isOwner}/>
          {invite}
        </Paper>
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
