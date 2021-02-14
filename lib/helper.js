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

const fillDays = (days, city, tags, activities, dayPlans) => {
  return days;
};
export default {
  draftPlan,
  getCityIdByName,
  findCloseCity,
  fillDays,
};
