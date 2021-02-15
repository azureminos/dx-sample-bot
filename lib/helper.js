import _ from 'lodash';
import CONSTANTS from './constants';

const {Global, Instance, DataModel} = CONSTANTS.get();

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
  return activities[city].products;
};

const fillDays = (
  days,
  totalPeople,
  targetCity,
  tags,
  activities,
  dayPlans
) => {
  for (let i = 0; i < days.length; i++) {
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
        const products = getProducts(tmpCity, tags, activities, dayPlans);
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
            unitPrice: p.price,
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
export default {
  draftPlan,
  getCityIdByName,
  findCloseCity,
  fillDays,
};
