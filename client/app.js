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
import PopupMessage from './components-v2/popup-message';
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
    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handlePopupClose = this.handlePopupClose.bind(this);
    this.handleRemoveCity = this.handleRemoveCity.bind(this);
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
      popup: {
        open: false,
        title: '',
        message: '',
      },
    };
  }
  /* ==============================
     = Event Handlers             =
     ============================== */
  handlePopupClose() {
    // console.log('>>>>handlePopupClose');
    const popup = {open: false, title: '', message: ''};
    this.setState({popup});
  }
  handleRemoveCity(dayNo, index) {
    console.log('>>>>handleRemoveCity', {dayNo, index});
    const popup = {open: false, title: '', message: ''};
    const {plan} = this.state;
    const day = plan.days[dayNo - 1];
    day.cities = _.concat(
      day.cities.slice(0, index),
      day.cities.slice(index + 1, day.cities.length)
    );
    if (index === 0) {
      const dayLast = plan.days[dayNo - 2];
      dayLast.cities = _.slice(dayLast.cities, 0, dayLast.cities.length - 1);
    } else if (day.cities.length - 1 === index) {
      const dayNext = plan.days[dayNo];
      dayNext.cities = _.concat(
        [day.cities[day.cities.length - 1]],
        dayNext.cities
      );
    }
    this.setState({plan, popup});
  }
  handleDragItem(result) {
    console.log('>>>>handleDragItem', result);
    const {draggableId, source, destination} = result;
    const {plan} = this.state;
    const reorg = (dayNo, idxSrc, idxDst) => {
      const day = plan.days[dayNo - 1];
      day.isCustomized = true;
      const tmpCity = day.cities[idxSrc];
      const IDX_DAY_START = 0;
      const IDX_DAY_END = plan.days[dayNo - 1].cities.length - 1;
      day.cities[idxSrc] = day.cities[idxDst];
      day.cities[idxDst] = tmpCity;
      // Extended logic
      if (idxSrc === IDX_DAY_START || idxDst === IDX_DAY_START) {
        // Set as the last city of previous day if moved first city of the day
        plan.days[dayNo - 2].cities.push(day.cities[0]);
        return true;
      } else if (idxSrc === IDX_DAY_END || idxDst === IDX_DAY_END) {
        // Set as the first city of next day if moved last city of the day
        plan.days[dayNo].cities = _.concat(
          [day.cities[day.cities.length - 1]],
          plan.days[dayNo].cities
        );
        return true;
      }
      return false;
    };
    const move = (src, dst) => {
      const srcDay = Number(src.droppableId.split('##')[1]);
      const srcCity = plan.days[srcDay - 1].cities[src.index];
      const dstDay = Number(dst.droppableId.split('##')[1]);
      const dstCities = plan.days[dstDay - 1].cities;
      const matcher = _.find(dstCities, (c) => {
        return c.name === srcCity.name;
      });
      if (!matcher) {
        // Only add city when it doesn't exist in target list
        plan.days[dstDay - 1].cities = _.concat(
          dstCities.slice(0, dst.index),
          [srcCity],
          dstCities.slice(dst.index, dstCities.length)
        );
        if (dst.index === 0) {
          // Set as the last city of previous day if moved first city of the day
        } else if (dst.index === dstCities.length - 1) {
          // Set as the first city of next day if moved last city of the day
        }
        return true;
      }
      return false;
    };

    const FIRST_DAY = 'day##1';
    const LAST_DAY = `day##${plan.days.length}`;
    const IDX_PLAN_START = 0;
    const IDX_PLAN_END = plan.days[plan.days.length - 1].cities.length - 1;

    if (source.droppableId === FIRST_DAY && source.index === IDX_PLAN_START) {
      // moved start city of first day, no action
      return;
    } else if (
      source.droppableId === LAST_DAY &&
      source.index === IDX_PLAN_END
    ) {
      // moved end city of last day, no action
      return;
    } else if (!destination) {
      // dropped outside the list, popup to confirm remove city
      const idxSrc = source.index;
      const dayNo = Number(draggableId.split('##')[1]);
      const {days} = this.state.plan;
      if (days[dayNo - 1].cities && days[dayNo - 1].cities.length > 1) {
        const cityName = days[dayNo - 1].cities[idxSrc].name;
        const popup = {
          open: true,
          title: 'Remove city from the itinerary',
          message: `Confirm to remove city ${cityName} from Day ${dayNo}`,
          buttons: [
            {
              name: 'No',
              click: () => {
                this.handlePopupClose();
              },
            },
            {
              name: 'Yes',
              click: () => {
                this.handleRemoveCity(dayNo, idxSrc);
              },
            },
          ],
        };
        this.setState({popup});
      }
      return;
    } else if (
      destination.droppableId === FIRST_DAY &&
      destination.index === IDX_PLAN_START
    ) {
      // moved item in front of start city of first day, no action
      return;
    } else if (
      destination.droppableId === LAST_DAY &&
      destination.index === IDX_PLAN_END
    ) {
      // moved item after of end city of last day, no action
      return;
    } else if (source.droppableId === destination.droppableId) {
      const idxSrc = source.index;
      const idxDst = destination.index;
      const dayNo = Number(draggableId.split('##')[1]);
      if (reorg(dayNo, idxSrc, idxDst)) this.setState({plan});
    }
    if (source.droppableId !== destination.droppableId) {
      if (move(source, destination)) this.setState({plan});
    }
  }
  handleSelectItem(input) {
    console.log('>>>>handleSelectItem', input);
    /*const {product, daySelected} = input;
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
    this.setState({plan});*/
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
          const tmpCities = days[days.length - 1].cities;
          if (tmpCities && tmpCities.length > 0) {
            days[days.length - 1].cities.push(plan.endCity);
          } else {
            days[days.length - 1].cities = [plan.endCity];
            days[days.length - 1].items = [];
          }
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
      plan.days[0].items = [];
      plan.days[plan.days.length - 1].cities = [city];
      plan.days[plan.days.length - 1].items = [];
    }
    this.setState({plan});
  }
  handleSetDestination(input) {
    const {plan, planExt, reference} = this.state;
    const {preferAttractions, selectedTagGroups} = planExt;
    const {activities, dayPlans} = reference;
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
    // Ignore existing
    let isExist = false;
    let isUpdate = false;
    let isAdded = false;
    for (let i = 0; i < plan.days.length; i++) {
      const day = plan.days[i];
      const matcher = _.find(day.cities, (cc) => {
        return cc.name === name;
      });
      if (matcher) {
        isExist = true;
        break;
      }
      if (!day.cities || day.cities.length === 0) {
        day.cities = [city];
        day.items = [];
        isAdded = true;
      } else if (!day.isCustomized && day.cities.length === 1 && !isUpdate) {
        day.cities.push(city);
        isUpdate = true;
        isAdded = true;
      } else if (!day.isCustomized && isUpdate) {
        if (i === plan.days.length - 1) {
          day.cities = [city, plan.endCity];
          day.items = [];
        } else {
          day.cities = [city];
          day.items = [];
        }
      }
    }
    if (isExist) {
      return;
    } else if (!isAdded) {
      // TODO: add nearest city if not added
    }
    console.log('>>>>handleSetDestination completed', plan);
    // Load related activity if new destination
    if (!activities[name]) {
      this.pushToRemote('ref:activity', {
        city: name,
        cityId: destinationId,
      });
    } else {
      // Fill the days
      plan.days = Helper.fillDays(
        plan.days,
        plan.totalPeople,
        name,
        selectedTagGroups,
        activities,
        dayPlans
      );
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
      const matcher = _.find(d.cities, (c) => {
        return c.name === results.city;
      });
      return !!matcher;
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
            destName: a.primaryDestinationName,
            isUserSelected: true,
            totalPeople: plan.totalPeople,
            unitPrice: 0,
            imgUrl: a.thumbnailURL,
            notes: '',
          });
        }
      }
    }
    // Fill the day with products (max 3 items per day)
    plan.days = Helper.fillDays(
      plan.days,
      plan.totalPeople,
      results.city,
      selectedTagGroups,
      activities,
      dayPlans
    );
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
    const {homepage, plan, planExt, reference, popup} = this.state;
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
          handleSelectItem: this.handleSelectItem,
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
          <PopupMessage
            open={popup.open}
            handleClose={this.handlePopupClose}
            title={popup.title}
            message={popup.message}
            buttons={popup.buttons}
          />
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(App);
