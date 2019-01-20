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
import ListNotFound from './list_not_found.jsx';
import LoadingScreen from './loading_screen.jsx';
import FixedTab from './components/fixed-tab';
import PackageItinerary from './package-itinerary';

import _ from 'lodash';

let socket;

/* ==============================
   = React Application          =
   ============================== */

export default class AppView extends React.Component {
  constructor(props) {
    super(props);

    this.initView = this.initView.bind(this);

    this.state = {
      pkg: null,
      cityAttractions: null,
      cityHotels: null,
      cities: null,
      updating: false,
    };
  }

  static propTypes = {
    apiUri: PropTypes.string.isRequired,
    packageId: PropTypes.number.isRequired,
    socketAddress: PropTypes.string.isRequired,
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
    console.log(`>>>>Push event[${channel}] with message`, message);
    this.setState({updating: true}); // Set the updating spinner
    socket.emit(
      `push:${channel}`,
      message,
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
  /* ---------- Hotels ---------- */
  setSelectedHotel(hotel) {
    console.log('>>>>setSelectedHotel', hotel);
  }
  /* ----------  Display Package ------- */
  initView({pkg, cityAttractions, cityHotels, cities}) {
    console.log(
      '>>>>Result coming back from socket [view:init]',
      {pkg, cityAttractions, cityHotels, cities},
    );

    _.forEach(_.values(cityAttractions), (attractions) => {
      _.forEach(attractions, (a) => {
        a.isLiked = !!_.find(pkg.items, (item) => { return item.attractionId == a.id;});
      });
    });
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

    this.setState({pkg: pkg, cityAttractions, cityHotels, cities});
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
    socket.on('package:view', this.initView);

    this.pushToRemote(
      'package:view',
      {packageId: this.props.packageId}
    );
  }

  render() {
    const {
      pkg,
      cityAttractions,
      cityHotels,
      socketStatus,
    } = this.state;

    let page;

    if (pkg) {
      console.log(
        '>>>>Landing at readonly package details page',
        {props: this.props, state: this.state}
      );
      const {apiUri} = this.props;

      page = (
        <Paper>
          <Typography>
            <PackageItinerary
              instPackage={pkg}
              cityAttractions={cityAttractions}
              cityHotels={cityHotels}
              apiUri={apiUri}
              isReadonly
              selectHotel={this.setSelectedHotel}
            />
          </Typography>
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
