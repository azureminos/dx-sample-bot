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
import PageAllTravel from './pages/pg-main';
import PageStartTrip from './pages/pg-start-trip';
import PagePlanTrip from './pages/pg-plan-trip';
// ==== HELPERS =======================================
import Helper from '../lib/helper';
import CONSTANTS from '../lib/constants';

// ==== CSS ==============================================
// import 'swiper/css/swiper.css';
import 'react-multi-carousel/lib/styles.css';
import '../public/style.css';
import {getDynamicStyles} from 'jss';

// Variables
const styles = (theme) => ({});
const {Instance, SocketChannel, Page, DataModel} = CONSTANTS.get();
const dummyCities = [
  'Gold Coast',
  'Byron Bay',
  'Coffs Harbour',
  'Port Stephens',
  'Newcastle',
  'Hunter Valley',
];

let socket;

/* ==============================
   = React Application          =
   ============================== */
class App extends React.Component {
  constructor(props) {
    super(props);
    // Register socket event handler
    this.pushToRemote = this.pushToRemote.bind(this);
    this.init = this.init.bind(this);
    this.register = this.register.bind(this);
    this.setOnlineUsers = this.setOnlineUsers.bind(this);
    this.handleRefAll = this.handleRefAll.bind(this);
    this.handleRefActivity = this.handleRefActivity.bind(this);
    this.handleRefDestination = this.handleRefDestination.bind(this);
    // Register on-page event handler
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    this.handlePeopleChange = this.handlePeopleChange.bind(this);
    this.handleTagGroupChange = this.handleTagGroupChange.bind(this);
    this.handleSetStartCity = this.handleSetStartCity.bind(this);
    this.handleSetDestination = this.handleSetDestination.bind(this);
    this.handleBtnStartHoliday = this.handleBtnStartHoliday.bind(this);
    this.handleDragItem = this.handleDragItem.bind(this);
    this.handleSelectProduct = this.handleSelectProduct.bind(this);
    // State
    this.state = {
      updating: false,
      user: null,
      socketStatus: '',
      plan: null,
      planExt: {
        country: 'Australia',
        cities: [],
        selectedTagGroups: [],
      },
      reference: {
        destinations: [],
        categories: [],
        tagGroups: [],
        activities: {},
      },
    };
  }
  /* ==============================
     = Event Handlers             =
     ============================== */
  handleDragItem(result) {
    console.log('>>>>handleDragItem', result);
    const {source, destination} = result;
    const reorder = (droppableId, idxSource, idxDestination) => {
      const arr = droppableId.split('##');
      const day = Number(arr[1]);
      const {plan} = this.state;
      const {items} = plan.days[day - 1];
      const tmp = items[idxDestination];
      items[idxDestination] = items[idxSource];
      items[idxSource] = tmp;
      this.setState({plan});
    };
    const move = (
      source,
      destination,
      droppableSource,
      droppableDestination
    ) => {
      const sarr = source.split('##');
      const darr = destination.split('##');
      const sday = Number(sarr[1]);
      const dday = Number(darr[1]);
      const {plan} = this.state;
      const sourceClone = Array.from(plan.days[sday - 1].items);
      const destClone = Array.from(plan.days[dday - 1].items);
      const [removed] = sourceClone.splice(droppableSource.index, 1);
      destClone.splice(droppableDestination.index, 0, removed);

      plan.days[sday - 1].items = sourceClone;
      plan.days[dday - 1].items = destClone;
      this.setState({plan});
    };
    // dropped outside the list
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      reorder(source.droppableId, source.index, destination.index);
    } else {
      move(source.droppableId, destination.droppableId, source, destination);
    }
  }
  handleSelectProduct({product, daySelected}) {
    console.log('>>>>handleSelectProduct', {product, daySelected});
    const {plan} = this.state;
    const day = plan.days[daySelected - 1];
    const matcher = _.find(day.items, (i) => {
      return i.itemId === product.productCode;
    });
    if (matcher) {
      // Remove item from the list
      day.items = _.filter(day.items, function(i) {
        return i.itemId !== product.productCode;
      });
    } else if (day.items.length < 3) {
      // Add item into the list
      day.items.push({
        name: product.name,
        itemType: DataModel.TravelPlanItemType.PRODUCT,
        itemId: product.productCode,
        totalPeople: 1,
        unitPrice: product.price,
        notes: '',
      });
    } else {
      console.warn('max 3 activities per day');
      return;
    }
    this.setState({plan});
  }
  handleBtnStartHoliday() {
    const {plan} = this.state;
    plan.status = Instance.status.INITIATED;
    this.setState({plan});
  }
  handleDateRangeChange({startDate, endDate}) {
    // console.log('>>>>handleDateRangeChange', {startDate, endDate});
    const {plan} = this.state;
    const getDays = (startDate, endDate, plan) => {
      let {days} = plan;
      const totalDays = endDate.diff(startDate, 'days') + 1;
      if (!days || days.length === 0) {
        days = [];
        for (let i = 0; i < totalDays; i++) {
          const startCity = i === 0 ? plan.startCity : '';
          const startCityId = i === 0 ? plan.startCityId : null;
          const endCity = i === totalDays - 1 ? plan.endCity : '';
          const endCityId = i === totalDays - 1 ? plan.endCityId : null;
          days.push({
            dayNo: i + 1,
            items: [],
            startCity: startCity || '',
            startCityId: startCityId || 0,
            endCity: endCity || '',
            endCityId: endCityId || 0,
          });
        }
      } else if (days.length > totalDays) {
        // remove extra days in the array
        days = _.slice(days, 0, totalDays);
        if (plan.endCity) {
          days[days.length - 1].endCity = plan.endCity;
        }
      } else if (days.length < totalDays) {
        // add missing days in the array
        const tmpCity = days[days.length - 1].startCity || '';
        const tmpCityId = days[days.length - 1].startCityId || 0;
        days[days.length - 1].endCity = tmpCity;
        days[days.length - 1].endCityId = tmpCityId;
        for (let i = days.length; i < totalDays; i++) {
          days.push({
            dayNo: i + 1,
            items: [],
            startCity: tmpCity,
            startCityId: tmpCityId,
            endCity: tmpCity,
            endCityId: tmpCityId,
          });
        }
        if (plan.endCity) {
          days[days.length - 1].endCity = plan.endCity;
        }
      }
      return {totalDays, days};
    };
    const {days, totalDays} =
      startDate && endDate ? getDays(startDate, endDate, plan) : plan;
    this.setState({
      plan: {...plan, startDate, endDate, totalDays, days},
    });
  }
  handlePeopleChange(delta) {
    // console.log('>>>>handlePeopleChange', people);
    const {plan} = this.state;
    plan.totalPeople = plan.totalPeople + delta;
    this.setState({plan});
  }
  handleTagGroupChange(tagGroup) {
    // console.log('>>>>handleTagGroupChange', tagGroup);
    const {selectedTagGroups} = this.state.planExt;
    if (
      !_.find(selectedTagGroups, (s) => {
        return s === tagGroup;
      })
    ) {
      selectedTagGroups.push(tagGroup);
    } else {
      _.pull(selectedTagGroups, tagGroup);
    }
    this.setState({
      planExt: {...this.state.planExt, selectedTagGroups},
    });
  }
  handleSetStartCity(input) {
    // console.log('>>>>handleSetStartCity', input);
    const {plan} = this.state;
    const {destinationId, name} = input;
    plan.startCity = name;
    plan.startCityId = destinationId;
    plan.endCity = name;
    plan.endCityId = destinationId;
    for (let i = 0; i < plan.days.length; i++) {
      if (i === 0) {
        plan.days[i].startCity = plan.startCity;
        plan.days[i].startCityId = plan.startCityId;
      }
      if (i === plan.days.length - 1) {
        plan.days[i].endCity = plan.endCity;
        plan.days[i].endCityId = plan.endCityId;
      }
    }
    this.setState({plan});
  }
  handleSetDestination(input) {
    const {plan, reference} = this.state;
    const {destinationId, name} = input;
    console.log('>>>>handleSetDestination', {input, plan});
    let tmpEndCity = '';
    let tmpEndCityId = 0;
    let toUpdate = false;
    for (let i = 0; i < plan.days.length - 1; i++) {
      const day = plan.days[i];
      if (toUpdate || !day.endCity || day.endCity === day.startCity) {
        tmpEndCity = !toUpdate ? name : tmpEndCity;
        tmpEndCityId = !toUpdate ? destinationId : tmpEndCityId;
        plan.days[i].endCity = tmpEndCity;
        plan.days[i].endCityId = tmpEndCityId;
        plan.days[i + 1].startCity = tmpEndCity;
        plan.days[i + 1].startCityId = tmpEndCityId;
        toUpdate = true;
      }
    }
    // Logic to add city to otherCities when all days have an end city
    console.log('>>>>handleSetDestination completed', plan);
    this.pushToRemote('ref:activity', {
      city: name,
      cityId: destinationId,
    });
    this.setState({plan});
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
    // console.log('>>>>MobileApp.register', {viewerId, instId});
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
    // console.log('>>>>Result from socket [init]', results);
    const {user, homepage} = results;
    let plan = this.state.plan;
    if (homepage === Page.NewPlan) {
      plan = Helper.draftPlan();
    }
    this.setState({plan, user, homepage, updating: false});
    // Extra logic
    if (homepage === Page.MainPage) {
      this.pushToRemote('plan:list', {senderId: this.props.viewerId});
    } else if (homepage === Page.NewPlan) {
      this.pushToRemote('ref:all', {country: this.state.planExt.country});
    }
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
  // --------  Reference  ---------
  handleRefAll(results) {
    // console.log('>>>>Result from socket [ref:all]', results);
    const {categories, destinations, tagGroups} = results;
    const {reference} = this.state;
    this.setState({
      updating: false,
      reference: {...reference, categories, destinations, tagGroups},
    });
  }
  handleRefDestination(results) {
    // console.log('>>>>Result from socket [ref:destination]', results);
    const {reference} = this.state;
    this.setState({
      updating: false,
      reference: {...reference, destinations: results},
    });
  }
  handleRefActivity(results) {
    // console.log('>>>>Result from socket [ref:activity]', results);
    const {reference} = this.state;
    const {activities} = reference;
    activities[results.city] = {
      products: results.products,
      attractions: results.attractions,
    };
    this.setState({
      updating: false,
      reference: {...reference, activities},
    });
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
    socket.on('ref:all', this.handleRefAll);
    socket.on('ref:activity', this.handleRefActivity);
    socket.on('ref:destination', this.handleRefDestination);

    const {viewerId, planId} = this.props;
    const handleMount = (vid, pid) => {
      if (vid) {
        this.pushToRemote('plan:view', {
          senderId: vid,
          planId: pid,
        });
      } else {
        console.log('>>>>NO viewerId');
      }
    };
    handleMount(viewerId, planId);
  }

  render() {
    // Local Variables
    console.log('>>>>MobileApp.render', {state: this.state, props: this.props});
    const {apiUri, viewerId, windowWidth} = this.props;
    const {homepage, plan, planExt, reference} = this.state;
    // Sub Components
    let page = <div>Loading...</div>;
    if (homepage === Page.MainPage) {
      document.title = 'My Holiday Plans';
      page = <PageAllTravel />;
    } else if (homepage === Page.NewPlan) {
      document.title = 'Start My Holiday';
      if (reference.tagGroups) {
        const actionsStartTrip = {
          handleDateRangeChange: this.handleDateRangeChange,
          handleTagGroupChange: this.handleTagGroupChange,
          handleSetStartCity: this.handleSetStartCity,
          handlePeopleChange: this.handlePeopleChange,
          handleBtnStartHoliday: this.handleBtnStartHoliday,
        };
        const actionsPlanTrip = {
          handleDateRangeChange: this.handleDateRangeChange,
          handleSetDestination: this.handleSetDestination,
          handlePeopleChange: this.handlePeopleChange,
        };
        page =
          plan.status === Instance.status.DRAFT ? (
            <PageStartTrip
              plan={plan}
              planExt={planExt}
              reference={reference}
              actions={actionsStartTrip}
            />
          ) : (
            <PagePlanTrip
              plan={plan}
              planExt={planExt}
              reference={reference}
              actions={actionsPlanTrip}
            />
          );
      }
    }
    /* ----------  Animated Wrapper  ---------- */
    return (
      <div id='app' style={{margin: '0px', height: '100%'}}>
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
