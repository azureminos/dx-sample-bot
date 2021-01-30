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
import PageAllTravel from './pages/pg-main';
import PagePlanTrip from './pages/pg-plan-trip';
// ==== HELPERS =======================================
import Helper from '../lib/helper';
import PackageHelper from '../lib/package-helper';
import CONSTANTS from '../lib/constants';

// ==== CSS ==============================================
// import 'swiper/css/swiper.css';
import 'react-multi-carousel/lib/styles.css';
import '../public/style.css';

// Variables
const styles = (theme) => ({});
const {Global, Instance, SocketChannel, Page, DataModel} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const SocketAction = SocketChannel.Action;
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
    this.handleTagGroupChange = this.handleTagGroupChange.bind(this);
    this.handleSetStartCity = this.handleSetStartCity.bind(this);
    this.handleSetDestination = this.handleSetDestination.bind(this);
    this.handleDragItem = this.handleDragItem.bind(this);
    this.handleSelectProduct = this.handleSelectProduct.bind(this);

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
    console.log('>>>>handleDateRangeChange', result);
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
  handleDateRangeChange({startDate, endDate}) {
    console.log('>>>>handleDateRangeChange', {startDate, endDate});
    const {plan} = this.state;
    if (startDate && endDate) {
      let {days} = this.state.plan;
      const totalDays = endDate.diff(startDate, 'days') + 1;
      if (!days || days.length === 0) {
        days = [];
        for (let i = 0; i < totalDays; i++) {
          days.push({
            dayNo: i + 1,
            items: [],
            startCity: '',
            endCity: '',
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
        days[days.length - 1].endCity = tmpCity;
        for (let i = days.length; i < totalDays; i++) {
          days.push({
            dayNo: i + 1,
            items: [],
            startCity: tmpCity,
            endCity: tmpCity,
          });
        }
        if (plan.endCity) {
          days[days.length - 1].endCity = plan.endCity;
        }
      }
      this.setState({
        plan: {...plan, totalDays, startDate, endDate, days},
      });
    } else {
      this.setState({
        plan: {...plan, startDate, endDate},
      });
    }
  }
  handleTagGroupChange(tagGroup) {
    console.log('>>>>handleTagGroupChange', tagGroup);
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
    const {plan} = this.state;
    const {address, location} = input;
    console.log('>>>>doHandleSetStartCity', {input, plan});
    const dummyCity = 'Sydney';
    plan.startCity = dummyCity;
    plan.endCity = dummyCity;
    for (let i = 0; i < plan.days.length; i++) {
      if (i === 0) {
        plan.days[i].startCity = plan.startCity;
      }
      if (i === plan.days.length - 1) {
        plan.days[i].endCity = plan.endCity;
      }
    }
    console.log('>>>>doHandleSetStartCity completed', plan);
    this.setState({plan});
  }
  handleSetDestination(input) {
    const {plan, reference} = this.state;
    const {address, location} = input;
    console.log('>>>>handleSetDestination', {input, plan});
    let tmpEndCity = '';
    let toUpdate = false;
    for (let i = 0; i < plan.days.length - 1; i++) {
      const day = plan.days[i];
      if (toUpdate || !day.endCity || day.endCity === day.startCity) {
        tmpEndCity = !toUpdate ? dummyCities.pop() : tmpEndCity;
        plan.days[i].endCity = tmpEndCity;
        plan.days[i + 1].startCity = tmpEndCity;
        toUpdate = true;
      }
    }
    // Logic to add city to otherCities when all days have an end city
    console.log('>>>>handleSetDestination completed', plan);
    this.pushToRemote('ref:activity', {
      city: tmpEndCity,
      cityId: Helper.getCityIdByName(tmpEndCity, reference.destinations),
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
    console.log('>>>>Result from socket [ref:all]', results);
    const {categories, destinations, tagGroups} = results;
    const {reference} = this.state;
    this.setState({
      updating: false,
      reference: {...reference, categories, destinations, tagGroups},
    });
  }
  handleRefDestination(results) {
    console.log('>>>>Result from socket [ref:destination]', results);
    const {reference} = this.state;
    this.setState({
      updating: false,
      reference: {...reference, destinations: results},
    });
  }
  handleRefActivity(results) {
    console.log('>>>>Result from socket [ref:activity]', results);
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
      document.title = 'My travel plans';
      page = <PageAllTravel />;
    } else if (homepage === Page.NewPlan) {
      document.title = 'Create new travel plan';
      if (reference.tagGroups) {
        const actions = {
          handleDateRangeChange: this.handleDateRangeChange,
          handleTagGroupChange: this.handleTagGroupChange,
          handleSetStartCity: this.handleSetStartCity,
          handleSetDestination: this.handleSetDestination,
          handleSelectProduct: this.handleSelectProduct,
          handleDragItem: this.handleDragItem,
        };
        page = (
          <PagePlanTrip
            plan={plan}
            planExt={planExt}
            reference={reference}
            actions={actions}
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
