import _ from 'lodash';
import CONSTANTS from './constants';

const {Global, Instance} = CONSTANTS.get();
const instStatus = Instance.status;

const draftPlan = () => {
  return {
    status: instStatus.DRAFT,
    totalPeople: Global.defaultPeople,
    days: [],
  };
};

export default {
  draftPlan,
};
