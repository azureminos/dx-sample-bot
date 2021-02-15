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

// Variables
let socket;
const styles = (theme) => ({});
const {Instance, SocketChannel, Page, DataModel} = CONSTANTS.get();
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
        preferAttractions: [],
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
    /* const {draggableId, source, destination} = result;
    const {destinations} = this.state.reference;
    const move = (drag, src, dst) => {
      const cityId = Number(drag.split('##')[2]);
      const isMoveAfter = dst.index === 1;
      const dayFrom = Number(src.droppableId.split('##')[1]);
      const dayTo = Number(dst.droppableId.split('##')[1]);
      const {plan} = this.state;
      const {totalDays, days} = plan;

      if ((dayTo === totalDays && isMoveAfter) || dayFrom === totalDays) {
        // Invalid move, do nothing
        console.log('>>>>handleDragItem invalid move');
      } else {
        const sCity = _.find(destinations, (d) => {
          return d.destinationId === cityId;
        });
        console.log('>>>>handleDragItem found city', {sCity, days});
        days[dayFrom - 1].endCity = '';
        days[dayFrom - 1].endCityId = 0;
        days[dayFrom].startCity = '';
        days[dayFrom].startCityId = 0;
        if (!isMoveAfter) {
          const otherCities = days[dayTo - 1].otherCities || [];
          otherCities.push({
            name: sCity.name,
            destinationId: sCity.destinationId,
          });
          days[dayTo - 1].otherCities = otherCities;
        } else {
          const otherCities = days[dayTo - 1].otherCities || [];
          otherCities.push({
            name: days[dayTo - 1].endCity,
            destinationId: days[dayTo - 1].endCityId,
          });
          days[dayTo - 1].otherCities = otherCities;
          days[dayTo - 1].endCity = sCity.name;
          days[dayTo - 1].endCityId = sCity.destinationId;
          days[dayTo].startCity = sCity.name;
          days[dayTo].startCityId = sCity.destinationId;
        }
        this.setState({plan});
      }
    };
    // dropped outside the list
    if (!destination) {
      return;
    }
    if (source.droppableId !== destination.droppableId) {
      move(draggableId, source, destination);
    }*/
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
          let tmpCity = null;
          if (i === 0) {
            tmpCity = plan.startCity;
          } else if (i === totalDays - 1) {
            tmpCity = plan.endCity;
          }
          days.push({
            dayNo: i + 1,
            items: [],
            cities: tmpCity ? [tmpCity] : [],
          });
        }
      } else if (days.length > totalDays) {
        // remove extra days in the array
        days = _.slice(days, 0, totalDays);
        if (plan.endCity) {
          let tmpCities = days[days.length - 1].cities;
          if (tmpCities && tmpCities.length > 0) {
            tmpCities.push(plan.endCity);
          } else {
            tmpCities = [plan.endCity];
          }
          days[days.length - 1].cities = tmpCities;
        }
      } else if (days.length < totalDays) {
        // TODO: add missing days in the array
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
    // TODO: Need to notify user of the change to TotalPeople
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
  handleSetStartCity(city) {
    console.log('>>>>handleSetStartCity', city);
    const {plan} = this.state;
    plan.startCity = city;
    plan.endCity = city;
    if (plan.days && plan.days.length > 0) {
      plan.days[0].cities = [city];
      plan.days[plan.days.length - 1].cities = [city];
    }
    this.setState({plan});
  }
  handleSetDestination(input) {
    const {plan, planExt, reference} = this.state;
    const {preferAttractions} = planExt;
    const {activities} = reference;
    const {city, attraction} = input;
    const {destinationId, name} = city;
    console.log('>>>>handleSetDestination', {input, plan});
    if (
      attraction &&
      !_.find(preferAttractions, (a) => {
        return a._id === attraction._id;
      })
    ) {
      preferAttractions.push({...attraction, destName: name});
    }

    let isUpdate = false;
    let isAdded = false;
    for (let i = 0; i < plan.days.length; i++) {
      const day = plan.days[i];
      if (!day.cities || day.cities.length === 0) {
        day.cities = [city];
        isAdded = true;
      } else if (!day.isCustomized && day.cities.length === 1 && !isUpdate) {
        day.cities.push(city);
        isUpdate = true;
        isAdded = true;
      } else if (!day.isCustomized && isUpdate) {
        day.cities = [city, plan.endCity];
      }
    }
    if (!isAdded) {
      // TODO: add nearest city if not added
    }

    // Logic to add city to otherCities when all days have an end city
    console.log('>>>>handleSetDestination completed', plan);
    // Load related activity if new destination
    if (!activities[name]) {
      this.pushToRemote('ref:activity', {
        city: name,
        cityId: destinationId,
      });
    }
    // Update State
    this.setState({plan, planExt});
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
    const {plan, planExt, reference} = this.state;
    const {preferAttractions, selectedTagGroups} = planExt;
    const {activities, dayPlans} = reference;
    const {products, attractions} = results;
    // Update reference
    activities[results.city] = {products, attractions};
    // Check user preferred attraction
    const dAttractions = _.filter(preferAttractions, (p) => {
      return p.destName === results.city;
    });
    const dDays = _.filter(plan.days, (d) => {
      return !!_.find(d.cities, (c) => {
        c.name === results.city;
      });
    });
    // Add attractions one by one to each days
    for (let i = 0; i < dAttractions.length; i++) {
      const a = _.find(attractions, (att) => {
        return att._id === dAttractions[i]._id;
      });
      if (a) {
        const dIdx = dDays.length >= dAttractions.length ? i : i % dDays.length;
        if (dDays[dIdx]) {
          dDays[dIdx].items = [];
          dDays[dIdx].items.push({
            name: a.name,
            itemType: DataModel.TravelPlanItemType.ATTRACTION,
            itemId: a.seoId,
            isUserSelected: true,
            totalPeople: plan.totalPeople,
            unitPrice: 0,
            notes: '',
          });
        }

        /* plan.days = Helper.fillDays(
          plan.days,
          results.city,
          selectedTagGroups,
          activities,
          dayPlans
        );*/
      }
    }
    // Fill the day with products (max 3 items per day)

    // Update state
    this.setState({
      updating: false,
      plan: plan,
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
          handleDragItem: this.handleDragItem,
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
