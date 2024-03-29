/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ==== MODULES ==========================================
import _ from 'lodash';
import moment from 'moment';
import io from 'socket.io-client';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {CSSTransitionGroup} from 'react-transition-group';
// ==== COMPONENTS ========================================
import PageAllTravel from './pages/pg-main';
import PageStartTrip from './pages/pg-start-trip';
import PagePlanTrip from './pages/pg-plan-trip';
import PageDisplayTrip from './pages/pg-display-trip';
import PopupMessage from './components-v2/popup-message';
import PopupPayment from './components-v2/popup-payment';
// ==== HELPERS =======================================
import Helper from '../lib/helper';
import CONSTANTS from '../lib/constants';

// ==== CSS ==============================================
// import 'swiper/css/swiper.css';
import 'react-multi-carousel/lib/styles.css';
import '../public/style.css';

// Variables
let socket;
const styles = () => ({});
const {Instance, Page, DataModel, Style} = CONSTANTS.get();
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
    this.handlePageClose = this.handlePageClose.bind(this);
    this.handlePlanSave = this.handlePlanSave.bind(this);
    this.handlePlanAll = this.handlePlanAll.bind(this);
    this.handleRefAll = this.handleRefAll.bind(this);
    this.handleRefActivity = this.handleRefActivity.bind(this);
    this.handleRefDestination = this.handleRefDestination.bind(this);
    // Register on-page event handler
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.handleViewItemDetails = this.handleViewItemDetails.bind(this);
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    this.handlePeopleChange = this.handlePeopleChange.bind(this);
    this.handleItemPeopleChange = this.handleItemPeopleChange.bind(this);
    this.handleTagGroupChange = this.handleTagGroupChange.bind(this);
    this.handleSetStartCity = this.handleSetStartCity.bind(this);
    this.handleSetDestination = this.handleSetDestination.bind(this);
    this.handleDragCity = this.handleDragCity.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handlePopupClose = this.handlePopupClose.bind(this);
    this.handleRemoveCity = this.handleRemoveCity.bind(this);
    this.handleUpdateHotel = this.handleUpdateHotel.bind(this);
    this.handleRemoveHotel = this.handleRemoveHotel.bind(this);
    this.handleClickPlanCard = this.handleClickPlanCard.bind(this);
    this.handleBtnStartHoliday = this.handleBtnStartHoliday.bind(this);
    this.handleBtnGoStart = this.handleBtnGoStart.bind(this);
    this.handleBtnGoPlan = this.handleBtnGoPlan.bind(this);
    this.handleBtnGoDisplay = this.handleBtnGoDisplay.bind(this);
    this.handleBtnGoPayment = this.handleBtnGoPayment.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    // State
    this.state = {
      homepage: '',
      tabSelected: 0,
      itemSelected: '',
      user: null,
      plans: null,
      plan: null,
      planExt: {
        country: 'Australia',
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
      payment: {
        open: false,
      },
    };
  }
  /* ==============================
     = Event Handlers             =
     ============================== */
  handlePayment(result) {
    console.log('>>>>handlePayment', result);
    const {plan} = this.state;
    plan.status = result.status;
    const payment = {open: false};
    this.setState({payment, plan});
    // Socket Update Plan Status
    const req = {
      senderId: this.props.viewerId,
      planId: plan._id,
      status: result.status,
    };
    this.pushToRemote('plan:updateStatus', req);
  }
  handleViewItemDetails(input) {
    console.log('>>>>handleViewItemDetails', input);
    this.setState({
      itemSelected: input.item.itemId,
      homepage: Page.FinalizePlan,
    });
  }
  handleBtnStartHoliday() {
    const {plan} = this.state;
    plan.status = Instance.status.INITIATED;
    this.setState({plan, homepage: Page.ShowPlan});
    if (!plan._id) {
      // Sync to server
      const senderId = this.props.viewerId;
      this.pushToRemote('plan:save', {plan, senderId});
    }
  }
  handleTabSelect(tabSelected) {
    // console.log('>>>>handleTabSelect');
    this.setState({tabSelected, itemSelected: '', homepage: Page.ShowPlan});
  }
  handleBtnGoStart() {
    // console.log('>>>>handleBtnGoStart');
    this.setState({homepage: Page.NewPlan});
  }
  handleBtnGoPlan() {
    // console.log('>>>>handleBtnGoPlan');
    this.setState({homepage: Page.ShowPlan});
  }
  handleBtnGoDisplay() {
    // console.log('>>>>handleBtnGoDisplay');
    this.setState({homepage: Page.FinalizePlan});
  }
  handleBtnGoPayment() {
    // console.log('>>>>handleBtnGoPayment');
    const payment = {open: true};
    this.setState({payment});
  }
  handlePopupClose() {
    // console.log('>>>>handlePopupClose');
    const popup = {open: false, title: '', message: ''};
    const payment = {open: false};
    this.setState({popup, payment});
  }
  handleClickPlanCard(planId) {
    console.log('>>>>handleClickPlanCard', planId);
    const senderId = this.props.viewerId;
    this.pushToRemote('plan:view', {senderId, planId});
  }
  handleUpdateHotel(input) {
    // console.log('>>>>handleUpdateHotel', input);
    const {dayNo, type, address, location} = input;
    const {plan} = this.state;
    const {destinations} = this.state.reference;
    const {country} = this.state.planExt;
    const hotel = {
      ...Helper.getHotelFromAddress(type, address, country, destinations),
      location,
    };
    // console.log('>>>>handleUpdateHotel rs', hotel);
    plan.days[dayNo - 1].hotel = hotel;
    this.setState({plan});
    // Socket Update Hotel
    const senderId = this.props.viewerId;
    const planId = plan._id;
    this.pushToRemote('hotel:save', {senderId, planId, dayNo, hotel});
  }
  handleRemoveHotel(dayNo) {
    // console.log('>>>>handleRemoveHotel', input);
    const {plan} = this.state;
    plan.days[dayNo - 1].hotel = null;
    this.setState({plan});
    // Socket Remove Hotel
    const senderId = this.props.viewerId;
    const planId = plan._id;
    // this.pushToRemote('hotel:remove', {senderId, planId, dayNo});
  }
  handleRemoveCity(dayNo, index) {
    console.log('>>>>handleRemoveCity', {dayNo, index});
    const popup = {open: false, title: '', message: ''};
    const {activities, dayPlans} = this.state.reference;
    const tags = this.state.planExt.selectedTagGroups;
    const plan = this.state.plan;
    const {totalAdults, totalKids, days} = plan;

    const day = days[dayNo - 1];
    day.cities = _.concat(
      day.cities.slice(0, index),
      day.cities.slice(index + 1, day.cities.length)
    );
    day.items = Helper.checkDayActivity(
      day,
      totalAdults,
      totalKids,
      tags,
      activities,
      dayPlans
    );
    if (index === 0) {
      const dayPrev = plan.days[dayNo - 2];
      if (dayPrev.cities && dayPrev.cities.length > 1) {
        dayPrev.cities = _.slice(dayPrev.cities, 0, dayPrev.cities.length - 1);
        dayPrev.items = Helper.checkDayActivity(
          dayPrev,
          totalAdults,
          totalKids,
          tags,
          activities,
          dayPlans
        );
      }
    } else if (index === day.cities.length - 1) {
      const dayNext = plan.days[dayNo];
      if (dayNext.cities && dayNext.cities.length > 1) {
        dayNext.cities = _.concat(
          [day.cities[day.cities.length - 1]],
          dayNext.cities
        );
        dayNext.items = Helper.checkDayActivity(
          dayNext,
          totalAdults,
          totalKids,
          tags,
          activities,
          dayPlans
        );
      }
    }
    this.setState({plan, popup});
    // Socket update plan
    const senderId = this.props.viewerId;
    this.pushToRemote('plan:save', {senderId, plan});
  }
  handleDragCity(result) {
    console.log('>>>>handleDragCity', result);
    const {draggableId, source, destination} = result;
    const {plan, planExt, reference} = this.state;
    const reorg = (dayNo, idxSrc, idxDst) => {
      const day = plan.days[dayNo - 1];
      day.isCustomized = true;
      const tmpCity = day.cities[idxSrc];
      day.cities[idxSrc] = day.cities[idxDst];
      day.cities[idxDst] = tmpCity;
      // Extended logic
      return tmpCity.name;
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
        return srcCity.name;
      }
      return null;
    };

    const FIRST_DAY = 'day##1';
    const LAST_DAY = `day##${plan.days.length}`;
    const IDX_PLAN_START = 0;
    const IDX_PLAN_END = plan.days[plan.days.length - 1].cities.length;

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
      if (reorg(dayNo, idxSrc, idxDst)) {
        this.setState({plan});
        // Socket update plan
        const senderId = this.props.viewerId;
        this.pushToRemote('plan:save', {senderId, plan});
      }
    }
    if (source.droppableId !== destination.droppableId) {
      const dayNo = Number(destination.droppableId.split('##')[1]);
      const cityName = move(source, destination);
      if (cityName) {
        const day = plan.days[dayNo - 1];
        if (!day.items || day.items.length === 0) {
          plan.days = Helper.fillDays(
            {days: plan.days, dayNo},
            plan.totalPeople,
            cityName,
            planExt.selectedTagGroups,
            reference.activities,
            reference.dayPlans
          );
        }
        this.setState({plan});
        // Socket update plan
        const senderId = this.props.viewerId;
        this.pushToRemote('plan:save', {senderId, plan});
      }
    }
  }
  handleSelectItem(input) {
    console.log('>>>>handleSelectItem', input);
    const {item, type, isSelected, dayNo} = input;
    const {plan} = this.state;
    const day = plan.days[dayNo - 1];
    if (isSelected) {
      // Item to remove
      day.isCustomized = true;
      day.items = _.filter(day.items, (it) => {
        return it.itemId !== item.itemId;
      });
      // Socket update plan item
      const req = {
        senderId: this.props.viewerId,
        planId: plan._id,
        dayNo: dayNo,
        itemId: item.itemId,
      };
      this.pushToRemote('planItem:remove', req);
    } else if (!isSelected && day.items.length < 3) {
      // Item to add
      day.isCustomized = true;
      const it =
        type === DataModel.TravelPlanItemType.PRODUCT
          ? {
            name: item.name,
            itemType: DataModel.TravelPlanItemType.PRODUCT,
            itemId: item.productCode,
            destName: item.primaryDestinationName,
            isUserSelected: true,
            totalPeople: plan.totalPeople,
            imgUrl: item.thumbnailURL,
            notes: '',
          }
          : {
            name: item.name,
            itemType: DataModel.TravelPlanItemType.ATTRACTION,
            itemId: item.seoId,
            destName: item.primaryDestinationName,
            isUserSelected: true,
            totalPeople: plan.totalPeople,
            totalPrice: 0,
            imgUrl: item.thumbnailURL,
            notes: '',
          };
      day.items.push(it);
      // Socket update plan item
      const req = {
        senderId: this.props.viewerId,
        planId: plan._id,
        dayNo: dayNo,
        item: it,
      };
      this.pushToRemote('planItem:add', req);
    } else {
      console.warn('max 3 activities per day');
      return;
    }
    this.setState({plan});
  }
  handleDateRangeChange({startDate, endDate}) {
    // console.log('>>>>handleDateRangeChange', {startDate, endDate});
    let plan = this.state.plan;
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
            hotel: null,
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
    plan = {...plan, startDate, endDate, totalDays, days};
    this.setState({plan});
    // Socket update plan when plan id exists
    if (plan._id) {
      const senderId = this.props.viewerId;
      this.pushToRemote('plan:save', {senderId, plan});
    }
  }
  handlePeopleChange(dAdult, dKid) {
    // console.log('>>>>handlePeopleChange', people);
    const {plan} = this.state;
    plan.totalAdults = (plan.totalAdults || 0) + dAdult;
    plan.totalKids = (plan.totalKids || 0) + dKid;
    plan.totalPeople = plan.totalAdults + plan.totalKids;
    for (let i = 0; plan.days && i < plan.days.length; i++) {
      const day = plan.days[i];
      for (let m = 0; day.items && m < day.items.length; m++) {
        day.items[m].totalPeople = plan.totalPeople;
        day.items[m].totalAdults = plan.totalAdults;
        day.items[m].totalKids = plan.totalKids;
      }
    }
    // TODO: Need to notify user of the change to TotalPeople
    this.setState({plan});
    // Socket update totalPeople when plan id exists
    if (plan._id) {
      const params = {
        senderId: this.props.viewerId,
        planId: plan._id,
        totalAdults: plan.totalAdults,
        totalKids: plan.totalKids,
      };
      this.pushToRemote('people:save', params);
    }
  }
  handleItemPeopleChange(val, dayNo, itemId) {
    console.log('>>>>handleItemPeopleChange', {val, dayNo, itemId});
    const {plan} = this.state;
    const {totalAdults, totalKids} = val;
    const params = {
      senderId: this.props.viewerId,
      planId: plan._id,
      dayNo: dayNo,
      itemId: itemId,
    };
    const day = plan.days[dayNo - 1];
    for (let i = 0; i < day.items.length; i++) {
      if (day.items[i].itemId === itemId) {
        day.items[i].totalAdults = totalAdults;
        day.items[i].totalKids = totalKids;
        day.items[i].totalPeople = totalAdults + totalKids;
        day.items[i].totalPrice = val.totalPrice;
        params.totalPeople = day.items[i].totalPeople;
        params.totalAdults = day.items[i].totalAdults;
        params.totalKids = day.items[i].totalKids;
        params.totalPrice = day.items[i].totalPrice;
      }
    }
    // TODO: Need to notify user of the change to TotalPeople
    this.setState({plan});
    // Socket update totalPeople when plan id exists
    if (plan._id) {
      this.pushToRemote('itemPeople:save', params);
    }
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
    this.pushToRemote('ref:activity', {
      city: city.name,
      cityId: city.destinationId,
    });
    // Socket update startCity when plan id exists
    if (plan._id) {
      /* const senderId = this.props.viewerId;
      const totalPeople = plan.totalPeople;
      const planId = plan._id;
      this.pushToRemote('people:save', {senderId, planId, totalPeople});*/
    }
  }
  handleSetDestination(input) {
    const {plan, planExt, reference} = this.state;
    const {preferAttractions, selectedTagGroups} = planExt;
    const {activities, dayPlans} = reference;
    const {dayNo, city, attraction} = input;
    const {destinationId, name} = city;
    console.log('>>>>handleSetDestination', {input, plan});
    if (
      attraction &&
      !_.find(preferAttractions, (a) => {
        return a._id === attraction._id;
      })
    ) {
      preferAttractions.push({...attraction, destName: name, dayNo});
    }
    // Ignore existing
    const day = plan.days[dayNo - 1];
    const matcher = _.find(day.cities, (cc) => {
      return cc.name === name;
    });
    if (matcher) return;
    if (!day.cities || day.cities.length === 0) {
      day.cities = [city];
      day.items = [];
    } else if (dayNo !== plan.days.length) {
      day.cities.push(city);
    } else {
      day.cities = [city, ...day.cities];
    }
    console.log('>>>>handleSetDestination completed', plan);
    // Load related activity if new destination
    if (!activities[name] && destinationId !== -1) {
      this.pushToRemote('ref:activity', {
        city: name,
        cityId: destinationId,
      });
    } else if (!activities[name] && destinationId === -1) {
      console.log(`>>>>${name} is a unknown city`);
    } else {
      // Fill the days
      plan.days = Helper.fillDays(
        {days: plan.days},
        plan.totalPeople,
        name,
        selectedTagGroups,
        activities,
        dayPlans
      );
    }
    // Update State
    this.setState({plan, planExt});
    // Socket update plan
    const senderId = this.props.viewerId;
    this.pushToRemote('plan:save', {senderId, plan});
  }
  /* ==============================
     = Helper Methods             =
     ============================== */

  /* ==============================
     = Socket Methods             =
     ============================== */
  pushToRemote(channel, message) {
    console.log(`>>>>Push event[${channel}] with message`, message);
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
  handlePageClose() {
    window.MessengerExtensions.requestCloseBrowser(null, null);
  }
  /* ----------  Package Instance ------- */
  init(results) {
    // console.log('>>>>Result from socket [init]', results);
    const {user, homepage} = results;
    if (homepage === Page.NewPlan) {
      const plan = Helper.draftPlan();
      this.setState({plan, user, homepage});
      this.pushToRemote('ref:all', {country: this.state.planExt.country});
    } else if (homepage === Page.MainPage) {
      this.setState({user, homepage});
      this.pushToRemote('plan:all', {senderId: this.props.viewerId});
      this.pushToRemote('ref:all', {country: this.state.planExt.country});
    } else if (homepage === Page.ShowPlan) {
      const plan = results.plan;
      const reference = {
        ...this.state.reference,
        activities: results.activities,
      };
      if (plan.startDate) plan.startDate = moment(plan.startDate);
      if (plan.endDate) plan.endDate = moment(plan.endDate);
      this.setState({plan, user, homepage, plans: [], reference});
    }
  }
  handlePlanSave(result) {
    console.log('>>>>Result from socket [plan:save]', result);
    const {plan} = this.state;
    plan._id = result.planId;
    this.setState({plan});
  }
  handlePlanAll(plans) {
    console.log('>>>>Result from socket [plan:all]', plans);
    for (let i = 0; plans && i < plans.length; i++) {
      const plan = plans[i];
      if (plan.startDate) plan.startDate = moment(plan.startDate);
      if (plan.endDate) plan.endDate = moment(plan.endDate);
      if (plan.createdAt) plan.createdAt = moment(plan.createdAt);
      if (plan.updatedAt) plan.updatedAt = moment(plan.updatedAt);
    }
    this.setState({plans});
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
      reference: {...reference, categories, destinations, tagGroups},
    });
  }
  handleRefDestination(results) {
    // console.log('>>>>Result from socket [ref:destination]', results);
    const {reference} = this.state;
    this.setState({reference: {...reference, destinations: results}});
  }
  handleRefActivity(results) {
    console.log('>>>>Result from socket [ref:activity]', results);
    const {plan, planExt, reference} = this.state;
    const {preferAttractions, selectedTagGroups} = planExt;
    const dayPlans = reference.dayPlans;
    const activities = reference.activities || {};
    if (Array.isArray(results)) {
      _.each(results, (r) => {
        activities[r.city] = {
          products: r.products,
          attractions: r.attractions,
        };
        this.setState({
          reference: {...reference, activities},
        });
      });
    } else {
      const {products, attractions} = results;
      // Update reference
      activities[results.city] = {products, attractions};
      if (
        (plan.startCity && plan.startCity.name === results.city) ||
        (plan.endCity && plan.endCity.name === results.city)
      ) {
        this.setState({
          reference: {...reference, activities},
        });
      } else {
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
            const dIdx =
              dDays.length >= dAttractions.length ? i : i % dDays.length;
            if (dDays[dIdx]) {
              dDays[dIdx].items = [];
              dDays[dIdx].items.push({
                name: a.name,
                itemType: DataModel.TravelPlanItemType.ATTRACTION,
                itemId: a.seoId,
                destName: a.primaryDestinationName,
                isUserSelected: true,
                totalPeople: plan.totalPeople,
                totalPrice: 0,
                imgUrl: a.thumbnailURL,
                notes: '',
              });
            }
          }
        }
        // Fill the day with products (max 3 items per day)
        plan.days = Helper.fillDays(
          {days: plan.days},
          plan.totalPeople,
          results.city,
          selectedTagGroups,
          activities,
          dayPlans
        );
        // Update state
        this.setState({
          plan: plan,
          reference: {...reference, activities},
        });
        // Socket update plan
        const senderId = this.props.viewerId;
        this.pushToRemote('plan:save', {senderId, plan});
      }
    }
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
    socket.on('page:close', this.handlePageClose);
    socket.on('ref:all', this.handleRefAll);
    socket.on('ref:activity', this.handleRefActivity);
    socket.on('ref:destination', this.handleRefDestination);
    socket.on('plan:save', this.handlePlanSave);
    socket.on('plan:all', this.handlePlanAll);

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
    const {homepage, tabSelected, itemSelected} = this.state;
    const {plan, planExt, reference, popup, payment} = this.state;
    // Sub Components
    let page = <div>Loading...</div>;
    if (homepage === Page.MainPage) {
      // document.title = 'My Holiday Plans';
      const actionsAllPlan = {
        handleClickPlanCard: this.handleClickPlanCard,
      };
      page = (
        <PageAllTravel plans={this.state.plans} actions={actionsAllPlan} />
      );
    } else if (homepage === Page.NewPlan) {
      // document.title = 'Start My Holiday';
      if (reference.tagGroups) {
        const actionsStartTrip = {
          handleDateRangeChange: this.handleDateRangeChange,
          handleTagGroupChange: this.handleTagGroupChange,
          handleSetStartCity: this.handleSetStartCity,
          handlePeopleChange: this.handlePeopleChange,
          handleBtnStartHoliday: this.handleBtnStartHoliday,
        };
        page = (
          <PageStartTrip
            plan={plan}
            planExt={planExt}
            reference={reference}
            actions={actionsStartTrip}
          />
        );
      }
    } else if (homepage === Page.ShowPlan) {
      // document.title = 'Update My Holiday';
      const actionsPlanTrip = {
        handleSetDestination: this.handleSetDestination,
        handleRemoveCity: this.handleRemoveCity,
        handleDragCity: this.handleDragCity,
        handleSelectItem: this.handleSelectItem,
        handleUpdateHotel: this.handleUpdateHotel,
        handleRemoveHotel: this.handleRemoveHotel,
        handleBtnGoStart: this.handleBtnGoStart,
        handleBtnGoDisplay: this.handleBtnGoDisplay,
        handleBtnGoPayment: this.handleBtnGoPayment,
        handleTabSelect: this.handleTabSelect,
        handleViewItemDetails: this.handleViewItemDetails,
      };
      page = (
        <PagePlanTrip
          tabSelected={tabSelected}
          plan={plan}
          planExt={planExt}
          reference={reference}
          actions={actionsPlanTrip}
        />
      );
    } else if (homepage === Page.FinalizePlan) {
      // document.title = 'Update My Holiday';
      const actionsDisplayTrip = {
        handleSetDestination: this.handleSetDestination,
        handleRemoveCity: this.handleRemoveCity,
        handleDragCity: this.handleDragCity,
        handleUpdateHotel: this.handleUpdateHotel,
        handleRemoveHotel: this.handleRemoveHotel,
        handleItemPeopleChange: this.handleItemPeopleChange,
        handleBtnGoStart: this.handleBtnGoStart,
        handleBtnGoPlan: this.handleBtnGoPlan,
        handleBtnGoPayment: this.handleBtnGoPayment,
        handleTabSelect: this.handleTabSelect,
      };
      page = (
        <PageDisplayTrip
          tabSelected={tabSelected}
          itemSelected={itemSelected}
          plan={plan}
          planExt={planExt}
          reference={reference}
          actions={actionsDisplayTrip}
        />
      );
    }
    /* ----------  Animated Wrapper  ---------- */
    return (
      <div
        id='app'
        style={{margin: '0px', height: '100%'}}
      >
        <CSSTransitionGroup
          transitionName='page'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {page}
          {popup.open ? (
            <PopupMessage
              open={popup.open}
              handleClose={this.handlePopupClose}
              title={popup.title}
              message={popup.message}
              buttons={popup.buttons}
            />
          ) : (
            ''
          )}
          {payment.open ? (
            <PopupPayment
              open={payment.open}
              plan={plan}
              handleClose={this.handlePopupClose}
              handlePayment={this.handlePayment}
            />
          ) : (
            ''
          )}
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(App);
