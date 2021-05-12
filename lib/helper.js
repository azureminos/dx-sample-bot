import _ from 'lodash';
import CONSTANTS from './constants';

const {Global, Country, Instance, DataModel} = CONSTANTS.get();

const draftPlan = () => {
  return {
    status: Instance.status.DRAFT,
    totalPeople: Global.defaultPeople,
    totalDays: 0,
    days: [],
  };
};
const getCityIdByName = (name, destinations) => {
  const {CITY, TOWN} = DataModel.DestinationType;
  const city = _.find(destinations, (d) => {
    return d.name === name && (d.type === CITY || d.type === TOWN);
  });
  return city ? city.destinationId : null;
};

const distanceBetweenLocations = (locationX, locationY) => {
  // console.log('>>>>Helper.distanceBetweenLocations', {locationX, locationY});
  const degreesToRadians = (degrees) => degrees * (Math.PI / 180);
  const radiansToDegrees = (radians) => radians * (180 / Math.PI);
  const centralSubtendedAngle = (locationX, locationY) => {
    const locationXLatRadians = degreesToRadians(locationX.latitude);
    const locationYLatRadians = degreesToRadians(locationY.latitude);
    return radiansToDegrees(
      Math.acos(
        Math.sin(locationXLatRadians) * Math.sin(locationYLatRadians) +
          Math.cos(locationXLatRadians) *
            Math.cos(locationYLatRadians) *
            Math.cos(
              degreesToRadians(
                Math.abs(locationX.longitude - locationY.longitude)
              )
            )
      )
    );
  };
  const earthRadius = 6371;
  const greatCircleDistance = (angle) =>
    2 * Math.PI * earthRadius * (angle / 360);
  return greatCircleDistance(centralSubtendedAngle(locationX, locationY));
};

const findCloseCity = (target, cities) => {
  console.log('>>>>Helper.findCloseCity', {target, cities});
  const results = _.map(cities, (c) => {
    if (!c.location) {
      return {
        distance: -1,
        name: c.name,
        destinationId: c.destinationId,
        state: c.state,
      };
    }
    const cLocation = c.location.split(', ');
    const cCity = {
      latitude: Number(cLocation[0]),
      longitude: Number(cLocation[1]),
    };
    const tLocation = target.split(', ');
    const tCity = {
      latitude: Number(tLocation[0]),
      longitude: Number(tLocation[1]),
    };
    return {
      distance: distanceBetweenLocations(tCity, cCity),
      location: c.location,
      name: c.name,
      destinationId: c.destinationId,
      state: c.state,
    };
  });
  // console.log('>>>>Helper.findCloseCity Tmp Result', results);
  return _.minBy(
    _.filter(results, (r) => {
      return r.distance > -1 && r.distance < 100;
    }),
    'distance'
  );
};

const getProducts = (city, tags, activities, dayPlans) => {
  const activity = activities[city];
  return activity ? activity.products : [];
};

const checkDayActivity = (
  day,
  totalPeople,
  tags,
  activities,
  dayPlans,
  isFullRefresh
) => {
  const {cities, items} = day;
  if (!cities || cities.length === 0) {
    return [];
  }
  day.items = _.filter(items, (it) => {
    return _.find(cities, (ct) => {
      return it.destName === ct.name;
    });
  });
  if (!day.items || day.items.length === 0 || isFullRefresh) {
    const tmpCity = day.cities[day.cities.length - 1].name;
    const products = getProducts(tmpCity, tags, activities, dayPlans);
    if (!products || products.length === 0) {
      return [];
    }
    for (let n = 0; n < Global.maxDayItems && products.length > 0; n++) {
      const p = products.pop();
      day.items.push({
        name: p.name,
        itemType: DataModel.TravelPlanItemType.PRODUCT,
        itemId: p.productCode,
        destName: p.primaryDestinationName,
        isUserSelected: false,
        totalPeople: totalPeople,
        imgUrl: p.thumbnailURL,
        notes: '',
      });
    }
  }
  return [...day.items];
};

const fillDays = (
  {days, dayNo},
  totalPeople,
  targetCity,
  tags,
  activities,
  dayPlans
) => {
  const keys = _.keys(activities);
  const tmpActivities = {};
  _.each(keys, (k) => {
    tmpActivities[k] = {
      products: [...activities[k].products],
      attractions: [...activities[k].attractions],
    };
  });
  for (let i = 0; i < days.length; i++) {
    // if (dayNo > 0 && i + 1 !== dayNo) continue;
    const day = days[i];
    if (day.cities && day.cities.length > 0) {
      const dayEndCity =
        i === days.length - 1
          ? day.cities[0].name
          : day.cities[day.cities.length - 1].name;
      if (!targetCity || (targetCity && dayEndCity === targetCity)) {
        const tmpCity = targetCity
          ? targetCity
          : day.cities[day.cities.length - 1].name;
        const products = getProducts(tmpCity, tags, tmpActivities, dayPlans);
        if (!products || products.length === 0) {
          break;
        }
        const items = _.filter(day.items, (it) => {
          const cityMatcher = _.find(day.cities, (ct) => {
            return ct.name === it.destName;
          });
          return cityMatcher && it.isUserSelected;
        });
        const initSize = items.length;
        for (
          let n = 0;
          n < Global.maxDayItems - initSize && products.length > 0;
          n++
        ) {
          const p = products.pop();
          items.push({
            name: p.name,
            itemType: DataModel.TravelPlanItemType.PRODUCT,
            itemId: p.productCode,
            destName: p.primaryDestinationName,
            isUserSelected: false,
            totalPeople: totalPeople,
            imgUrl: p.thumbnailURL,
            notes: '',
          });
        }
        day.items = items;
      }
    }
  }
  return [...days];
};
const getCityFromAddress = (type, address, country) => {
  let city = '';
  let state = '';
  const tmp = address.split(', ');
  let area = tmp[tmp.length - 2];
  const mCountry = _.find(Country, (c) => {
    return c.name === country;
  });
  if (mCountry) {
    const sStates = _.join(mCountry.state, '|');
    const rStates = new RegExp(` (${sStates})`, 'gi');
    const rStatesCode = new RegExp(` (${sStates}) (\\d{4})`, 'gi');
    if (rStatesCode.test(area)) {
      area = area.substring(0, area.lastIndexOf(' '));
      const idx = area.lastIndexOf(' ');
      city = area.substring(0, idx);
      state = area.substring(idx + 1);
    } else if (rStates.test(area)) {
      const idx = area.lastIndexOf(' ');
      city = area.substring(0, idx);
      state = area.substring(idx + 1);
    }
  }
  return {name: city, state};
};
const getHotelFromAddress = (type, address, country, destinations) => {
  let name = '';
  let city = '';
  let state = '';
  let cityId = -1;
  let tmpAddress = address;
  const mCountry = _.find(Country, (c) => {
    return c.name === country;
  });
  if (mCountry) {
    const sStates = _.join(mCountry.state, '|');
    const rStates = new RegExp(` (${sStates})`, 'gi');
    const rStatesCode = new RegExp(` (${sStates}) (\\d{4})`, 'gi');

    if (type === Global.ADDR_TYPE_STADDR) {
      const tmp = address.split(', ');
      let area = tmp[tmp.length - 2];
      if (rStatesCode.test(area)) {
        area = area.substring(0, area.lastIndexOf(' '));
        const idx = area.lastIndexOf(' ');
        city = area.substring(0, idx);
        state = area.substring(idx + 1);
      } else if (rStates.test(area)) {
        const idx = area.lastIndexOf(' ');
        city = area.substring(0, idx);
        state = area.substring(idx + 1);
      }
      const matcher = _.find(destinations, (d) => {
        return d.state === state && d.name === city;
      });
      if (matcher) cityId = matcher.destinationId;
    } else if (type === Global.ADDR_TYPE_ESTBSH) {
      const tmpIndex = address.indexOf(', ');
      name = address.substring(0, tmpIndex);
      tmpAddress = address.substring(tmpIndex + 2);
      const tmp = tmpAddress.split(', ');
      let area = tmp[tmp.length - 2];
      if (rStatesCode.test(area)) {
        area = area.substring(0, area.lastIndexOf(' '));
        const idx = area.lastIndexOf(' ');
        city = area.substring(0, idx);
        state = area.substring(idx + 1);
      } else if (rStates.test(area)) {
        const idx = area.lastIndexOf(' ');
        city = area.substring(0, idx);
        state = area.substring(idx + 1);
      }
      const matcher = _.find(destinations, (d) => {
        return d.state === state && d.name === city;
      });
      if (matcher) cityId = matcher.destinationId;
    }
  }
  return {
    name: name,
    address: tmpAddress,
    city: city,
    cityId: cityId,
  };
};

const validateAddressType = (types) => {
  const validTypes = Global.validAddressType;
  for (let i = 0; i < validTypes.length; i++) {
    const tmpType = validTypes[i];
    const matcher = _.find(types, (t) => {
      return t === tmpType;
    });
    if (matcher) {
      return matcher;
    }
  }
  return null;
};

const validatePlan = (plan) => {
  return null;
};

const comparePlan = (web, db) => {
  return null;
};

export default {
  draftPlan,
  getCityIdByName,
  getCityFromAddress,
  findCloseCity,
  comparePlan,
  getHotelFromAddress,
  validatePlan,
  validateAddressType,
  checkDayActivity,
  fillDays,
};
