/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ==== MODULES ==========================================
import _ from 'lodash';
import io from 'socket.io-client';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {CSSTransitionGroup} from 'react-transition-group';

// ==== COMPONENTS ========================================
import BotModal from './components/bot-modal';
import BotHeader from './components/bot-header';
import BotFooter from './components/bot-footer';
import ProgressBar from './components/progress-bar';
import DialogShare from './components/dialog-share';
import PackageItinerary from './package-itinerary';

// ==== HELPERS =======================================
import Helper from '../lib/helper';
import PackageHelper from '../lib/package-helper';
import CONSTANTS from '../lib/constants';

// ==== CSS ==============================================
import 'react-id-swiper/src/styles/css/swiper.css';

// Variables
const styles = (theme) => ({
  appBody: {
    position: 'absolute',
    top: 80,
    left: 0,
    marginLeft: 8,
    marginRight: 8,
    maxHeight: 515,
    overflowY: 'auto',
    width: '98%',
  },
});
const {Modal, Global, Instance} = CONSTANTS.get();
let socket;

/* ==============================
   = React Application          =
   ============================== */

class App extends React.Component {
  constructor(props) {
    super(props);
    // Register event handler
    this.init = this.init.bind(this);
    this.pushToRemote = this.pushToRemote.bind(this);
    this.handleDialogShareClose = this.handleDialogShareClose.bind(this);
    this.handleAddNotes = this.handleAddNotes.bind(this);
    this.handleAddedNotes = this.handleAddedNotes.bind(this);
    this.handleHdPeopleChange = this.handleHdPeopleChange.bind(this);
    this.handleHdRoomChange = this.handleHdRoomChange.bind(this);
    this.handleFtBtnBackward = this.handleFtBtnBackward.bind(this);
    this.handleFtBtnForward = this.handleFtBtnForward.bind(this);
    this.handleFtBtnShare = this.handleFtBtnShare.bind(this);
    this.handleFtBtnPayment = this.handleFtBtnPayment.bind(this);
    this.confirmSubmitPayment = this.confirmSubmitPayment.bind(this);
    this.handleFtBtnJoin = this.handleFtBtnJoin.bind(this);
    this.handleFtBtnLeave = this.handleFtBtnLeave.bind(this);
    this.handleFtBtnLock = this.handleFtBtnLock.bind(this);
    this.handleFtBtnUnlock = this.handleFtBtnUnlock.bind(this);
    this.handleFtBtnStatus = this.handleFtBtnStatus.bind(this);
    this.handleFtBtnCustomise = this.handleFtBtnCustomise.bind(this);
    this.handleFtBtnNoCustomise = this.handleFtBtnNoCustomise.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.enablePackageDiy = this.enablePackageDiy.bind(this);
    this.handleLikeAttraction = this.handleLikeAttraction.bind(this);
    this.confirmAddItinerary = this.confirmAddItinerary.bind(this);
    this.handleAddItinerary = this.handleAddItinerary.bind(this);
    this.confirmDeleteItinerary = this.confirmDeleteItinerary.bind(this);
    this.handleDeleteItinerary = this.handleDeleteItinerary.bind(this);
    this.handleSelectHotel = this.handleSelectHotel.bind(this);
    this.handleSelectFlight = this.handleSelectFlight.bind(this);
    this.handleSelectCar = this.handleSelectCar.bind(this);

    this.state = {
      updating: false,
      socketStatus: '',
      message: '',
      isOpenDialogShare: false,
      modalType: '',
      modalRef: null,
      instPackage: null,
      instPackageExt: null,
      reference: {
        cities: null,
        packageSummary: null,
      },
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
  handleDialogShareClose() {
    console.log('>>>>MobileApp.handleDialogShareClose');
    this.setState({
      isOpenDialogShare: false,
    });
  }
  handleDialogShareInvite() {
    console.log('>>>>MobileApp.handleDialogShareInvite');
    this.setState({
      isOpenDialogShare: false,
    });
  }
  handleModalClose() {
    console.log('>>>>MobileApp.handleModalClose');
    this.setState({
      modalType: '',
      modalRef: null,
    });
  }
  /* ----------  Package Instance ------- */
  init(results) {
    console.log('>>>>Result coming back from socket [init]', results);
    const {
      instance,
      packageSummary,
      cities,
      packageRates,
      flightRates,
    } = results;
    const reference = {packageSummary, cities};
    const carRates = _.map(cities, (c) => {
      return {
        id: c.id || '',
        name: c.name || '',
        carRates: c.carRates || [],
      };
    });
    const rates = {carRates, packageRates, flightRates};
    const instItems = _.map(instance.items, (item) => {
      if (item.attraction) {
        const match = Helper.findAttractionById(item.attraction, cities);
        item.attraction = match;
      }
      return item;
    });
    const instHotels = _.map(instance.hotels, (hotel) => {
      if (hotel.hotel) {
        const match = Helper.findHotelById(hotel.hotel, cities);
        hotel.hotel = match;
      }
      return hotel;
    });
    const instPackage = {
      ...instance,
      isCustomisable: packageSummary.isCustomisable,
      items: instItems,
      hotels: instHotels,
    };
    const instPackageExt = PackageHelper.enhanceInstance({
      userId: this.props.viewerId,
      instPackage: instPackage,
      rates: rates,
    });
    const matchingRates = PackageHelper.doRating({
      instPackage: instPackage,
      instPackageExt: instPackageExt,
      rates: rates,
    });

    this.setState({
      updating: false, // Turn spinner off
      reference,
      rates,
      instPackage: instPackage,
      instPackageExt: {...instPackageExt, ...matchingRates},
    });
  }
  // ----------  BotHeader  ----------
  handleHdPeopleChange(input) {
    console.log('>>>>MobileApp.handleHdPeopleChange');
    const {userId, instPackage, instPackageExt} = this.state;
    for (let i = 0; i < instPackage.members.length; i++) {
      if (instPackage.members[i].loginId === userId) {
        instPackage.members[i].people = input.people;
        instPackage.members[i].rooms = input.rooms;
      }
    }
    instPackageExt.people = input.people;
    instPackageExt.rooms = input.rooms;

    const matchingRates = PackageHelper.doRating({
      instPackage: instPackage,
      instPackageExt: instPackageExt,
      rates: input.rates,
    });

    this.setState({
      instPackage: {...instPackage, rate: matchingRates.curRate},
      instPackageExt: {...instPackageExt, ...matchingRates},
    });
  }
  handleHdRoomChange(input) {
    console.log('>>>>MobileApp.handleHdRoomChange');
    const {userId, instPackage, instPackageExt} = this.state;
    for (let i = 0; i < instPackage.members.length; i++) {
      if (instPackage.members[i].loginId === userId) {
        instPackage.members[i].rooms = input.rooms;
      }
    }

    instPackageExt.rooms = input.rooms;

    const matchingRates = PackageHelper.doRating({
      instPackage: instPackage,
      instPackageExt: instPackageExt,
      rates: input.rates,
    });

    this.setState({
      instPackage: {...instPackage, rate: matchingRates.curRate},
      instPackageExt: {...instPackageExt, ...matchingRates},
    });
  }
  // ----------  BotFooter  ----------
  handleFtBtnCustomise() {
    console.log('>>>>MobileApp.handleFtBtnCustomise');
    const {instPackage} = this.state;
    instPackage.isCustomised = true;
    this.setState({instPackage: instPackage});
  }
  handleFtBtnNoCustomise() {
    console.log('>>>>MobileApp.handleFtBtnNoCustomise');
    const {instPackage, instPackageExt} = this.state;
    instPackage.status = Instance.status.INITIATED;
    instPackage.isCustomised = false;
    instPackageExt.step = 0;
    this.setState({instPackage, instPackageExt});
  }
  handleFtBtnBackward() {
    console.log('>>>>MobileApp.handleFtBtnBackward');
    const {instPackage, instPackageExt} = this.state;
    instPackage.status = PackageHelper.getPreviousStatus(
      instPackage.isCustomised,
      instPackage.status
    );
    instPackageExt.step = instPackageExt.step - 1;
    this.setState({instPackage, instPackageExt});
  }
  handleFtBtnForward() {
    console.log('>>>>MobileApp.handleFtBtnForward');
    const {instPackage, instPackageExt} = this.state;
    if (PackageHelper.validateInstance(instPackage)) {
      instPackage.status = PackageHelper.getNextStatus(
        instPackage.isCustomised,
        instPackage.status
      );
      instPackageExt.step = instPackageExt.step + 1;
      this.setState({instPackage, instPackageExt});
    } else {
      // Todo
    }
  }
  handleFtBtnShare() {
    console.log('>>>>MobileApp.handleFtBtnShare');
    this.setState({
      isOpenDialogShare: true,
    });
  }
  handleFtBtnPayment(outcome) {
    console.log('>>>>MobileApp.handleFtBtnPayment', outcome);
    const {instPackage} = this.state;
    if (PackageHelper.validateInstance(instPackage)) {
      instPackage.status = outcome.status;
      this.setState({
        instPackage: instPackage,
        modalType: '',
        modalRef: null,
      });
    } else {
      // Todo
    }
  }
  handleFtBtnJoin() {
    console.log('>>>>MobileApp.handleFtBtnJoin');
  }
  handleFtBtnLeave() {
    console.log('>>>>MobileApp.handleFtBtnLeave');
  }
  handleFtBtnLock() {
    const {userId, instPackage, instPackageExt} = this.state;
    const {min, people, otherPeople, rooms, otherRooms} = instPackageExt;
    console.log('>>>>MobileApp.handleFtBtnLock', {instPackage, userId});
    // Before lock the package, start date and end date cannot be null
    if (!instPackage.startDate || !instPackage.endDate) {
      this.setState({
        modalType: Modal.INVALID_DATE.key,
      });
    } else if (people === 0) {
      this.setState({
        modalType: Modal.ZERO_OWNER.key,
        modalRef: {min: min},
      });
    } else if (people + otherPeople < min) {
      this.setState({
        modalType: Modal.LESS_THAN_MIN.key,
        modalRef: {min: min},
      });
    } else {
      instPackage.totalPeople = people + otherPeople;
      instPackage.totalRooms = rooms + otherRooms;
      instPackage.status = Instance.status.PENDING_PAYMENT;
      instPackageExt.step = instPackageExt.step + 1;
      for (let i = 0; i < instPackage.members.length; i++) {
        instPackage.members[i].status = Instance.status.PENDING_PAYMENT;
      }
      this.setState({instPackage, instPackageExt});
    }
  }
  handleFtBtnUnlock() {
    const {instPackage, instPackageExt} = this.state;
    instPackageExt.step = instPackageExt.step - 1;
    if (!instPackage.isCustomised) {
      // Regular package, change status to INITIATED
      instPackage.status = Instance.status.INITIATED;
    } else {
      // Customised package, change status to REVIEW ITINERARY
      instPackage.status = Instance.status.REVIEW_ITINERARY;
    }
    for (let i = 0; i < instPackage.members.length; i++) {
      instPackage.members[i].status = Instance.status.INITIATED;
    }
    this.setState({instPackage, instPackageExt});
  }
  handleFtBtnStatus() {
    console.log('>>>>MobileApp.handleFtBtnStatus');
  }
  // ----------  Payment  ---------
  confirmSubmitPayment() {
    const {instPackage} = this.state;
    const {startDate, endDate, totalPeople, totalRooms, rate} = instPackage;
    if (PackageHelper.validateInstance(instPackage)) {
      const ref = {
        dtStart: startDate,
        dtEnd: endDate,
        people: totalPeople,
        rooms: totalRooms,
        rate: rate,
        totalRate: totalPeople * rate,
      };
      this.setState({
        modalType: Modal.SUBMIT_PAYMENT.key,
        modalRef: ref,
      });
    } else {
      // Todo
    }
  }
  // ----------  Itinerary  ----------
  enablePackageDiy() {
    console.log('>>>>MobileApp.enablePackageDiy');
    const {instPackage} = this.state;
    instPackage.isCustomised = true;
    this.setState({
      instPackage: instPackage,
    });
  }
  confirmAddItinerary(ref) {
    console.log('>>>>MobileApp.confirmAddItinerary', ref);
    this.setState({
      modalType: Modal.ADD_ITINERARY.key,
      modalRef: ref,
    });
  }
  handleAddItinerary() {
    const ref = this.state.modalRef;
    console.log('>>>>MobileApp.handleAddItinerary', ref);
    const instPackage = PackageHelper.addItinerary(
      this.state.instPackage,
      ref.dayNo
    );
    if (PackageHelper.validateInstance(instPackage)) {
      instPackage.status = Instance.status.SELECT_ATTRACTION;
      this.setState({
        instPackage: instPackage,
        modalType: '',
      });
    } else {
      // Todo
    }
  }
  confirmDeleteItinerary(ref) {
    console.log('>>>>MobileApp.confirmDeleteItinerary', ref);
    this.setState({
      modalType: Modal.DELETE_ITINERARY.key,
      modalRef: ref,
    });
  }
  handleDeleteItinerary() {
    const ref = this.state.modalRef;
    const userId = this.state.userId;
    console.log('>>>>MobileApp.handleDeleteItinerary', ref);
    if (ref.isRequired) {
      this.setState({
        modalType: Modal.FAILED_DELETE_ITINERARY.key,
      });
    } else {
      const instPackage = PackageHelper.deleteItinerary(
        this.state.instPackage,
        ref.dayNo
      );
      if (PackageHelper.validateInstance(instPackage, userId)) {
        instPackage.status = Instance.status.SELECT_HOTEL;
        this.setState({
          instPackage: instPackage,
          modalType: '',
        });
      } else {
        // Todo
      }
    }
  }
  handleLikeAttraction(dayNo, timePlannable, item, attractions) {
    console.log('>>>>MobileApp.handleLikeAttraction', {
      dayNo,
      item,
      attractions,
      instPackage: this.state.instPackage,
    });
    // Functions
    const isOverloaded = (attractions) => {
      if (timePlannable === 0) {
        return true;
      }
      let timePlanned = 0;
      for (let i = 0; i < attractions.length; i++) {
        const attraction = attractions[i];
        if (attraction.isLiked) {
          timePlanned =
            timePlanned + attraction.timeTraffic + attraction.timeVisit;
          if (
            i > 0 &&
            _.findIndex(attractions[i].nearByAttractions, (item) => {
              return item === attractions[i - 1].id;
            }) > -1
          ) {
            timePlanned = timePlanned - 1;
          }
        }
      }
      return timePlannable <= timePlanned;
    };
    const mergeDayItems = (dayItems) => {
      const items = [];
      const days = Object.keys(dayItems);
      _.each(days, (day) => {
        _.each(dayItems[day], (item) => {
          items.push(item);
        });
      });
      return items;
    };
    // Logic starts here
    const {instPackage} = this.state;
    if (!instPackage.isCustomised) {
      // Package is not customised (DIY) yet, ask customer to confirm
      this.setState({
        modalType: Modal.ENABLE_DIY.key,
      });
    } else {
      // Package is customised (DIY) already, move on with rest of logic
      const action = item.isLiked ? 'DELETE' : 'ADD';
      if (action === 'ADD') {
        if (isOverloaded(attractions)) {
          // Activities over booked
          this.setState({
            modalType: Modal.FULL_ITINERARY.key,
            modalRef: {dayNo: dayNo},
          });
        } else {
          // Enough time for extra Activity
          const dayItems = _.groupBy(instPackage.items, (item) => {
            return item.dayNo;
          });
          const newItem = {
            id: -1,
            isMustVisit: false,
            timePlannable: Global.timePlannable,
            description: '',
            dayNo: dayNo,
            daySeq: Global.idxLastItem,
            attraction: {...item},
          };
          dayItems[dayNo].push(newItem);
          instPackage.items = mergeDayItems(dayItems);
          this.setState({instPackage: instPackage});
        }
      } else if (action === 'DELETE') {
        const dayItems = _.groupBy(instPackage.items, (item) => {
          return item.dayNo;
        });
        if (dayItems[dayNo].length === 1) {
          // Only one activity, can not be deleted
          this.setState({
            modalType: Modal.ONLY_ITINERARY.key,
            modalRef: {dayNo: dayNo},
          });
        } else {
          const newItems = [];
          _.each(dayItems[dayNo], (it) => {
            if (it.attraction.id !== item.id) {
              newItems.push({...it});
            }
          });
          dayItems[dayNo] = newItems;
          instPackage.items = mergeDayItems(dayItems);
          this.setState({instPackage: instPackage});
        }
      }
    }
  }
  // ----------  Package Instance Hotel  ----------
  handleSelectHotel(dayNo, item) {
    const {instPackage} = this.state;
    console.log('>>>>MobileApp.handleSelectHotel', instPackage);
    for (let i = 0; i < instPackage.hotels.length; i++) {
      const hotel = instPackage.hotels[i];
      if (Number(hotel.dayNo) === Number(dayNo)) {
        const city = hotel.hotel.city;
        hotel.hotel = {...item, city};
      }
    }
    this.setState({instPackage: instPackage});
  }
  // ----------  Package Instance Flight  ----------
  handleSelectFlight(startDate, endDate) {
    // console.log(`>>>>MobileApp.handleSelectFlight`, { startDate, endDate });
    const {instPackage} = this.state;
    instPackage.startDate = startDate;
    instPackage.endDate = endDate;
    this.setState({instPackage: instPackage});
  }
  // ----------  Package Instance Car  ----------
  handleSelectCar(selectedVal) {
    console.log('>>>>MobileApp.handleSelectCar', selectedVal);
    const {instPackage} = this.state;
    instPackage.carOption = selectedVal;
  }
  // ----------  Notes  ----------
  handleAddNotes(notes) {
    const instId = this.state.instPackage._id;
    console.log(`>>>>handleAddNotes of Inst[${instId}]`, notes);
    this.pushToRemote('user:addNotes', {text: notes});
  }
  handleAddedNotes(note) {
    const instId = this.state.instPackage._id;
    console.log(`>>>>handleAddedNotes of Inst[${instId}]`, note);
    const notes = this.state.instPackage.notes;
    notes.push(note);
    console.log('>>>>handleAddedNotes, notes', notes);
    const instPackage = {...this.state.instPackage, notes};
    console.log('>>>>handleAddedNotes, state update', instPackage);
    this.setState({instPackage});
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
  userJoin(newUser) {
    console.log('>>>>Result coming back from socket [user:join]', newUser);
    const oldUsers = this.state.users.slice();
    const existing = oldUsers.find((user) => user.fbId == newUser.fbId);
    let users;
    if (existing) {
      users = oldUsers.map((user) =>
        user.fbId === newUser.fbId ? newUser : user
      );
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
    socket = io.connect(this.props.socketAddress, {
      reconnect: true,
      secure: true,
    });

    // Add socket event handlers.
    socket.on('init', this.init);
    socket.on('user:join', this.userJoin);
    socket.on('user:addNotes', this.handleAddedNotes);

    const self = this;
    // Check for permission, ask if there is none
    window.MessengerExtensions.getGrantedPermissions(
      function(response) {
        // check if permission exists
        const permissions = response.permissions;
        if (permissions.indexOf('user_profile') > -1) {
          if (self.props.viewerId) {
            console.log('>>>>Send event[push:user:view]', self.props);
            self.pushToRemote('user:view', {
              senderId: self.props.viewerId,
              instId: self.props.instId,
            });
          } else {
            console.log('>>>>NO viewerId');
          }
        } else {
          window.MessengerExtensions.askPermission(
            function(response) {
              const isGranted = response.isGranted;
              if (isGranted && self.props.viewerId) {
                console.log('>>>>Send event[push:user:view]', self.props);
                self.pushToRemote('user:view', {
                  senderId: self.props.viewerId,
                  instId: self.props.instId,
                });
              } else {
                window.MessengerExtensions.requestCloseBrowser(null, null);
              }
            },
            function(errorCode, errorMessage) {
              console.error({errorCode, errorMessage});
              window.MessengerExtensions.requestCloseBrowser(null, null);
            },
            'user_profile'
          );
        }
      },
      function(errorCode, errorMessage) {
        console.error({errorCode, errorMessage});
        window.MessengerExtensions.requestCloseBrowser(null, null);
      }
    );
  }

  render() {
    const {instPackage, instPackageExt, rates} = this.state;
    const {modalType, modalRef, reference, isOpenDialogShare} = this.state;
    const {cities, packageSummary} = reference;
    const {classes, apiUri, viewerId} = this.props;

    console.log('>>>>MobileApp.render', this.state);
    let page = <div>Loading...</div>;
    if (instPackage) {
      // Variables
      const carOptions = instPackage.isCustomised
        ? Helper.getValidCarOptions(rates.carRates)
        : [instPackage.carOption];
      const departDates = _.map(
        packageSummary.departureDate.split(','),
        (d) => {
          return d.trim();
        }
      );
      const transport = {
        departDates: departDates,
        startDate: instPackage.startDate,
        totalDays: instPackage.totalDays,
        carOption: instPackage.carOption,
        carOptions: carOptions,
      };
      const itineraries = PackageHelper.getFullItinerary({
        isCustomised: instPackage.isCustomised,
        cities: cities,
        packageItems: instPackage.items,
        packageHotels: instPackage.hotels,
      });
      const headerActions = {
        handlePeople: this.handleHdPeopleChange,
        handleRoom: this.handleHdRoomChange,
      };
      const footerActions = {
        handleBackward: this.handleFtBtnBackward,
        handleForward: this.handleFtBtnForward,
        handleShare: this.handleFtBtnShare,
        handlePay: this.confirmSubmitPayment,
        handleJoin: this.handleFtBtnJoin,
        handleLeave: this.handleFtBtnLeave,
        handleLock: this.handleFtBtnLock,
        handleUnlock: this.handleFtBtnUnlock,
        handleStatus: this.handleFtBtnStatus,
        handleCustomise: this.handleFtBtnCustomise,
        handleCancelCustomise: this.handleFtBtnNoCustomise,
      };
      const itineraryActions = {
        handleSelectHotel: this.handleSelectHotel,
        handleSelectFlight: this.handleSelectFlight,
        handleSelectCar: this.handleSelectCar,
        handleLikeAttraction: this.handleLikeAttraction,
        handleAddItinerary: this.confirmAddItinerary,
        handleDeleteItinerary: this.confirmDeleteItinerary,
      };
      const modalActions = {
        handleModalClose: this.handleModalClose,
        handleDeleteItinerary: this.handleDeleteItinerary,
        handleAddItinerary: this.handleAddItinerary,
        handlePayment: this.handleFtBtnPayment,
      };
      // ======Web Elements======
      // Dialog Share
      const elDialogShare = (
        <DialogShare
          open={isOpenDialogShare}
          viewerId={viewerId}
          title={packageSummary.name}
          instId={instPackage._id}
          description={packageSummary.description}
          imageUrl={packageSummary.imageUrl}
          apiUri={apiUri}
          pushToRemote={this.pushToRemote}
          handleClose={this.handleDialogShareClose}
          handleShare={this.handleShareOnMessenger}
        />
      );
      // Bot Modal
      const elModal = modalType ? (
        <BotModal
          modal={modalType}
          actions={modalActions}
          reference={modalRef}
        />
      ) : (
        ''
      );
      page = (
        <div>
          <BotHeader
            instPackage={instPackage}
            instPackageExt={instPackageExt}
            rates={rates}
            actions={headerActions}
          />
          <div className={classes.appBody}>
            <ProgressBar
              step={instPackageExt.step}
              isOwner={instPackageExt.isOwner}
              isCustomised={instPackage.isCustomised}
            />
            <PackageItinerary
              isCustomised={instPackage.isCustomised}
              rates={rates}
              transport={transport}
              itineraries={itineraries}
              status={instPackage.status}
              actions={itineraryActions}
            />
          </div>
          <BotFooter
            instPackage={instPackage}
            instPackageExt={instPackageExt}
            rates={rates}
            actions={footerActions}
          />
          {elModal}
          {elDialogShare}
        </div>
      );
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

export default withStyles(styles, {withTheme: true})(App);
