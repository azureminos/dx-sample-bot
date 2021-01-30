import _ from 'lodash';
import CONSTANTS from './constants';

const {Global, Instance, DataModel} = CONSTANTS.get();
const instStatus = Instance.status;

const draftPlan = () => {
  return {
    status: instStatus.DRAFT,
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

export default {
  draftPlan,
  getCityIdByName,
};
