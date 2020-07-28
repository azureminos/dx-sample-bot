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
import BotModal from './components/bot-modal-v2';
import DialogShare from './components/dialog-share';
import PackageAll from './package-all';
import PackageItinerary from './package-itinerary-new';
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
    this.update = this.update.bind(this);
    this.showAll = this.showAll.bind(this);
    this.register = this.register.bind(this);
    this.handleDialogShareClose = this.handleDialogShareClose.bind(this);
    this.handleHdPeopleChange = this.handleHdPeopleChange.bind(this);
    this.handleHdRoomChange = this.handleHdRoomChange.bind(this);
    this.handleFtBtnShare = this.handleFtBtnShare.bind(this);
    this.handleFtBtnPayment = this.handleFtBtnPayment.bind(this);
    this.confirmSubmitPayment = this.confirmSubmitPayment.bind(this);
    this.handleFtBtnLock = this.handleFtBtnLock.bind(this);
    this.handleFtBtnUnlock = this.handleFtBtnUnlock.bind(this);
    this.handleFtBtnStatus = this.handleFtBtnStatus.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.enablePackageDiy = this.enablePackageDiy.bind(this);
    this.disablePackageDiy = this.disablePackageDiy.bind(this);
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
      isOpenDialogShare: false,
      user: null,
      socketStatus: '',
      message: '',
      modalType: '',
      modalRef: null,
      rates: null,
      packages: [],
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
  showAll(results) {
    console.log('>>>>Result from socket [package:showAll]', results);
    this.setState({
      updating: false,
      packages: results,
      instPackage: null,
      instPackageExt: null,
      rates: null,
    });
  }
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
    console.log('>>>>Result from socket [init]', results);
    const {
      instance,
      packageSummary,
      cities,
      packageRates,
      flightRates,
      user,
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
      instPackage: instPackage,
      instPackageExt: {...instPackageExt, ...matchingRates},
      reference,
      rates,
      user,
    });
  }
  update(results) {
    console.log('>>>>Result from socket [package:update]', results);
    const {action, senderId, params} = results;
    const {instPackage, rates} = this.state;
    const {viewerId} = this.props;
    let update = false;
    if (action === SocketAction.UPDATE_PEOPLE) {
      console.log('>>>>Start to process people update');
      const {instPackage} = this.state;
      if (instPackage.status !== params.statusInstance) {
        instPackage.status = params.statusInstance;
        update = true;
      }
      for (let i = 0; i < instPackage.members.length; i++) {
        const member = instPackage.members[i];
        if (member.loginId === senderId) {
          if (member.people !== params.people) {
            member.people = params.people;
            update = true;
          }
          if (member.rooms !== params.rooms) {
            member.rooms = params.rooms;
            update = true;
          }
          if (member.status !== params.statusMember) {
            member.status = params.statusMember;
            update = true;
          }
        }
      }
    } else if (action === SocketAction.UPDATE_ROOMS) {
      console.log('>>>>Start to process rooms update');
      const {instPackage} = this.state;
      if (instPackage.status !== params.statusInstance) {
        instPackage.status = params.statusInstance;
        update = true;
      }
      for (let i = 0; i < instPackage.members.length; i++) {
        const member = instPackage.members[i];
        if (member.loginId === senderId) {
          if (member.rooms !== params.rooms) {
            member.rooms = params.rooms;
            update = true;
          }
          if (member.status !== params.statusMember) {
            member.status = params.statusMember;
            update = true;
          }
        }
      }
    } else if (action === SocketAction.UPDATE_DATE) {
      console.log('>>>>Start to process date update');
    } else if (action === SocketAction.ADD_MEMBER) {
      console.log('>>>>Start to process new member');
    } else if (action === SocketAction.USER_JOIN) {
      console.log('>>>>Start to process user join');
      const {instPackage} = this.state;
      if (params && params.loginId) {
        update = true;
        instPackage.members.push(params);
      }
    } else if (action === SocketAction.USER_LEAVE) {
      console.log('>>>>Start to process user leave');
      update = true;
      const {instPackage} = this.state;
      _.remove(instPackage.members, (m) => {
        return m.loginId === senderId;
      });
    }
    // Check if updated
    if (update) {
      const instPackageExt = PackageHelper.enhanceInstance({
        userId: viewerId,
        instPackage: instPackage,
        rates: rates,
      });
      const matchingRates = PackageHelper.doRating({
        instPackage: instPackage,
        instPackageExt: instPackageExt,
        rates: rates,
      });
      this.setState({
        updating: false,
        instPackage: instPackage,
        instPackageExt: {...instPackageExt, ...matchingRates},
      });
    } else {
      this.setState({
        updating: false,
      });
    }
  }
  // ----------  BotHeader  ----------
  handleHdPeopleChange(input) {
    console.log('>>>>MobileApp.handleHdPeopleChange', input);
    let tmpMember = null;
    const {viewerId} = this.props;
    const {user, instPackage, instPackageExt} = this.state;
    const isExist = !!_.find(instPackage.members, (m) => {
      return m.loginId === viewerId;
    });
    if (isExist) {
      for (let i = 0; i < instPackage.members.length; i++) {
        if (instPackage.members[i].loginId === viewerId) {
          instPackage.members[i].people = input.people;
          instPackage.members[i].rooms = input.rooms;
        }
      }
    } else {
      tmpMember = {
        memberId: user._id,
        loginId: user.loginId,
        name: user.name,
        isOwner: false,
        status: InstanceStatus.IN_PROGRESS,
        people: input.people,
        rooms: input.rooms,
      };
      instPackage.members.push(tmpMember);
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
    const action = isExist
      ? SocketAction.UPDATE_PEOPLE
      : SocketAction.ADD_MEMBER;
    const params = isExist
      ? {
        people: input.people,
        rooms: input.rooms,
        statusInstance: InstanceStatus.IN_PROGRESS,
        statusMember: InstanceStatus.IN_PROGRESS,
      }
      : tmpMember;
    const req = {
      senderId: viewerId,
      instId: instPackage._id,
      action: action,
      params: params,
    };
    this.pushToRemote('package:update', req);
  }
  handleHdRoomChange(input) {
    console.log('>>>>MobileApp.handleHdRoomChange', input);
    let tmpMember = null;
    const {viewerId} = this.props;
    const {user, instPackage, instPackageExt} = this.state;
    const isExist = !!_.find(instPackage.members, (m) => {
      return m.loginId === viewerId;
    });
    if (isExist) {
      for (let i = 0; i < instPackage.members.length; i++) {
        if (instPackage.members[i].loginId === viewerId) {
          instPackage.members[i].rooms = input.rooms;
        }
      }
    } else {
      tmpMember = {
        memberId: user._id,
        loginId: user.loginId,
        name: user.name,
        isOwner: false,
        status: InstanceStatus.IN_PROGRESS,
        people: input.people,
        rooms: input.rooms,
      };
      instPackage.members.push(tmpMember);
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
    // Update status and sync to server
    const action = isExist
      ? SocketAction.UPDATE_ROOMS
      : SocketAction.ADD_MEMBER;
    const params = isExist
      ? {
        rooms: input.rooms,
        statusInstance: InstanceStatus.IN_PROGRESS,
        statusMember: InstanceStatus.IN_PROGRESS,
      }
      : tmpMember;
    const req = {
      senderId: viewerId,
      instId: instPackage._id,
      action: action,
      params: params,
    };
    this.pushToRemote('package:update', req);
  }
  // ----------  BotFooter  ----------
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
      modalType: '',
      modalRef: null,
    });
  }
  disablePackageDiy() {
    console.log('>>>>MobileApp.disablePackageDiy');
    const {instPackage, instPackageExt} = this.state;
    instPackage.status = Instance.status.INITIATED;
    instPackage.isCustomised = false;
    instPackageExt.step = 0;
    this.setState({
      instPackage,
      instPackageExt,
      modalType: '',
      modalRef: null,
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
        modalRef: null,
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
        modalRef: null,
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
          modalRef: null,
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
    const hasNearBy = (target, idx, existing) => {
      for (let i = 0; i < idx && existing.length; i++) {
        if (
          _.findIndex(existing[i].nearByAttractions, (aid) => {
            return aid === target.id;
          }) > -1
        ) {
          return true;
        }
      }
      return false;
    };
    const isOverloaded = (existing, target) => {
      if (timePlannable === 0) {
        return true;
      }
      let timePlanned = 0;
      for (let i = 0; i < existing.length; i++) {
        const attraction = existing[i];
        timePlanned =
          timePlanned + attraction.timeTraffic + attraction.timeVisit;
        if (i > 0 && hasNearBy(attraction, i, existing)) {
          timePlanned = timePlanned - 1;
        }
      }
      if (timePlanned >= timePlannable) {
        return true;
      }
      timePlanned = timePlanned + target.timeTraffic + target.timeVisit;
      if (hasNearBy(target, existing.length, existing)) {
        timePlanned = timePlanned - 1;
      }
      if (timePlanned >= timePlannable + 1) {
        return true;
      }
      return false;
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
        modalRef: {isSmallPopup: true},
      });
    } else {
      // Package is customised (DIY) already, move on with rest of logic
      const action = item.isLiked ? 'DELETE' : 'ADD';
      if (action === 'ADD') {
        const fAttractions = _.filter(attractions, (a) => {
          return a.isLiked && a.id !== item.id;
        });
        if (isOverloaded(fAttractions, item)) {
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
  handleSelectFlight(stStartDate) {
    console.log('>>>>MobileApp.handleSelectFlight', stStartDate);
    const {instPackage} = this.state;
    const {totalDays} = instPackage;
    const mStartDate = Moment(stStartDate, Global.dateFormat);
    instPackage.startDate = mStartDate.toDate();
    instPackage.endDate = mStartDate.add(totalDays, 'days').toDate();
    this.setState({instPackage: instPackage});
  }
  // ----------  Package Instance Car  ----------
  handleSelectCar(carOption) {
    console.log('>>>>MobileApp.handleSelectCar', carOption);
    const {instPackage} = this.state;
    instPackage.carOption = carOption;
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
    socket.on('package:update', this.update);
    socket.on('package:showAll', this.showAll);

    const {viewerId, packageId, instId} = this.props;
    const handleMount = (vid, iid, pid) => {
      if (vid && !pid && !iid) {
        console.log('>>>>Load All Package');
        this.pushToRemote('package:showAll', {senderId: vid});
      } else if (vid && pid && !iid) {
        console.log('>>>>View Package', {viewerId: vid, packageId: pid});
        this.pushToRemote('package:view', {
          senderId: vid,
          packageId: pid,
        });
      } else if (vid && iid) {
        console.log('>>>>View Package Instance', {viewerId: vid, instId: iid});
        this.pushToRemote('user:view', {
          senderId: vid,
          instId: iid,
        });
      } else {
        console.log('>>>>NO viewerId');
      }
    };
    // Check for permission, ask if there is none
    window.MessengerExtensions.getGrantedPermissions(
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
        console.error('>>>>getPermissions Failed', {errorCode, errorMessage});
        document.getElementById('message').innerHTML = `${errorCode} : ${errorMessage}`;
        // window.MessengerExtensions.requestCloseBrowser(null, null);
      }
    );
  }

  render() {
    // Local Variables
    console.log('>>>>MobileApp.render', this.state);
    document.getElementById('message').innerHTML = '>>>>MobileApp.render';
    try {
      const {isOpenDialogShare, updating} = this.state;
      const {packages, instPackage, instPackageExt, rates} = this.state;
      const {modalType, modalRef, reference} = this.state;
      const {cities, packageSummary} = reference;
      const {apiUri, viewerId, windowWidth} = this.props;
      const itineraryActions = {
        handlePeople: this.handleHdPeopleChange,
        handleRoom: this.handleHdRoomChange,
        handleShare: this.handleFtBtnShare,
        handlePayment: this.confirmSubmitPayment,
        handleSelectHotel: this.handleSelectHotel,
        handleSelectFlight: this.handleSelectFlight,
        handleSelectCar: this.handleSelectCar,
        handleLikeAttraction: this.handleLikeAttraction,
        handleAddItinerary: this.confirmAddItinerary,
        handleDeleteItinerary: this.confirmDeleteItinerary,
      };
      const modalActions = {
        handleClose: this.handleModalClose,
        handleDeleteItinerary: this.handleDeleteItinerary,
        handleAddItinerary: this.handleAddItinerary,
        handlePayment: this.handleFtBtnPayment,
        handleCustomise: this.enablePackageDiy,
      };
      // Sub Components
      let page = <div>Loading...</div>;
      if (instPackage) {
        // Update Webview Title
        document.title = packageSummary.name;
        // Variables
        // ======Web Elements======
        // Dialog Share
        const elDialogShare = (
          <DialogShare
            open={isOpenDialogShare}
            viewerId={viewerId}
            instId={instPackage._id}
            title={packageSummary.name}
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
            <PackageItinerary
              updating={updating}
              instPackage={instPackage}
              instPackageExt={instPackageExt}
              rates={rates}
              cities={cities}
              packageSummary={packageSummary}
              actions={itineraryActions}
              windowWidth={windowWidth}
            />
            {elModal}
            {elDialogShare}
          </div>
        );
      } else if (packages && packages.length > 0) {
        page = (
          <PackageAll
            packages={packages}
            viewerId={viewerId}
            pushToRemote={this.pushToRemote}
          />
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
    } catch (e) {
      console.log('>>>>MobileApp.exception', e);
      document.getElementById('message').innerHTML = `>>>>MobileApp.exception: ${JSON.stringify(e)}`;
    }
  }
}

export default withStyles(styles, {withTheme: true})(App);
