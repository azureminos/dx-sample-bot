import _ from 'lodash';
import async from 'async';
import moment from 'moment';
import mongoose from './mongoose';
import ObjectParser from '../lib/object-parser';
import CONSTANTS from '../lib/constants';

const {Global, Instance} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const Schema = mongoose.Schema;

/* ============= New Schemas ============= */
// Reference   - Country
const nCountry = new Schema({
  name: Schema.Types.String,
  region: Schema.Types.String,
});
const DbCountry = mongoose.model('RefCountry', nCountry);
// Reference   - Destination
const nDestination = new Schema({
  name: Schema.Types.String,
  selectable: Schema.Types.Boolean,
  defaultCurrencyCode: Schema.Types.String,
  parentId: Schema.Types.Number,
  lookupId: Schema.Types.String,
  timeZone: Schema.Types.String,
  type: Schema.Types.String,
  destinationId: Schema.Types.Number,
  location: Schema.Types.String,
  addrCarpark: Schema.Types.String,
});
const DbDestination = mongoose.model('RefDestination', nDestination);
// Reference   - TagGroup
const nTagGroup = new Schema({
  name: Schema.Types.String,
  tags: [Schema.Types.String],
});
const DbTagGroup = mongoose.model('RefTagGroup', nTagGroup);
// Reference   - Category
const nCategory = new Schema({
  name: Schema.Types.String,
  itemId: Schema.Types.Number,
  thumbnailURL: Schema.Types.String,
  thumbnailHiResURL: Schema.Types.String,
});
const DbCategory = mongoose.model('RefCategory', nCategory);
// Reference   - SubCategory
const nSubCategory = new Schema({
  name: Schema.Types.String,
  itemId: Schema.Types.Number,
  parentId: Schema.Types.Number,
});
const DbSubCategory = mongoose.model('RefSubCategory', nSubCategory);
// Reference   - Product
const nProduct = new Schema({
  productCode: Schema.Types.String,
  name: Schema.Types.String,
  shortTitle: Schema.Types.String,
  primaryDestinationName: Schema.Types.String,
  primaryDestinationId: Schema.Types.Number,
  catIds: [Schema.Types.String],
  subCatIds: [Schema.Types.String],
  shortDescription: Schema.Types.String,
  duration: Schema.Types.String,
  thumbnailHiResURL: Schema.Types.String,
  thumbnailURL: Schema.Types.String,
  rating: Schema.Types.Number,
  reviewCount: Schema.Types.Number,
  photoCount: Schema.Types.Number,
  price: Schema.Types.Number,
  currencyCode: Schema.Types.String,
  onSale: Schema.Types.Boolean,
  specialOfferAvailable: Schema.Types.Boolean,
  hotelPickup: Schema.Types.Boolean,
  addrCheckIn: Schema.Types.String,
  tags: [Schema.Types.String],
});
const DbProduct = mongoose.model('RefProduct', nProduct);
// Reference   - Attraction
const nAttraction = new Schema({
  name: Schema.Types.String,
  seoId: Schema.Types.Number,
  webURL: Schema.Types.String,
  description: Schema.Types.String,
  summary: Schema.Types.String,
  primaryDestinationName: Schema.Types.String,
  primaryDestinationId: Schema.Types.Number,
  primaryGroupId: Schema.Types.Number,
  thumbnailHiResURL: Schema.Types.String,
  thumbnailURL: Schema.Types.String,
  rating: Schema.Types.Number,
  photoCount: Schema.Types.Number,
  latitude: Schema.Types.String,
  longitude: Schema.Types.String,
  attractionStreetAddress: Schema.Types.String,
  attractionCity: Schema.Types.String,
  attractionState: Schema.Types.String,
  tags: [Schema.Types.String],
});
const DbAttraction = mongoose.model('RefAttraction', nAttraction);
// Reference   - Day Plan
const nDayPlan = new Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  type: Schema.Types.String,
  cities: Schema.Types.Mixed,
  hotel: Schema.Types.Mixed,
  notes: Schema.Types.String,
});
const DbDayPlan = mongoose.model('RefDayPlan', nDayPlan);
// Reference   - Day Plan Item
const nDayPlanItem = new Schema({
  dayPlan: {type: Schema.Types.ObjectId, ref: 'RefDayPlan'},
  itemType: Schema.Types.String,
  itemId: Schema.Types.String,
  notes: Schema.Types.String,
});
const DbDayPlanItem = mongoose.model('RefDayPlanItem', nDayPlanItem);
// Transaction - Travel Plan
const nTravelPlan = new mongoose.Schema({
  status: Schema.Types.String,
  startDate: Schema.Types.Date,
  endDate: Schema.Types.Date,
  startCity: Schema.Types.Mixed,
  endCity: Schema.Types.Mixed,
  totalPeople: Schema.Types.Number,
  rate: Schema.Types.Number,
  notes: Schema.Types.String,
  tagGroups: [Schema.Types.String],
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const DbTravelPlan = mongoose.model('TravelPlan', nTravelPlan);
// Transaction - Travel Plan Day
const nTravelPlanDay = new mongoose.Schema({
  travelPlan: {type: Schema.Types.ObjectId, ref: 'TravelPlan'},
  dayNo: Schema.Types.Number,
  cities: [Schema.Types.Mixed],
  hotel: Schema.Types.Mixed,
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const DbTravelPlanDay = mongoose.model('TravelPlanDay', nTravelPlanDay);
// Transaction - Travel Plan Item
const nTravelPlanItem = new mongoose.Schema({
  travelPlan: {type: Schema.Types.ObjectId, ref: 'TravelPlan'},
  travelPlanDay: {type: Schema.Types.ObjectId, ref: 'TravelPlanDay'},
  dayNo: Schema.Types.Number,
  itemType: Schema.Types.String,
  itemId: Schema.Types.String,
  name: Schema.Types.String,
  destName: Schema.Types.String,
  imgUrl: Schema.Types.String,
  totalPeople: Schema.Types.Number,
  unitPrice: Schema.Types.Number,
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const DbTravelPlanItem = mongoose.model('TravelPlanItem', nTravelPlanItem);
/* ============= New Functions ============= */
const getAllDestination = (country, callback) => {
  // console.log('>>>>Model.getAllDestination', country);
  const cols = 'name location destinationId type lookupId';
  async.parallel(
    {
      states: (callback1) => {
        DbDestination.find({type: 'REGION'})
          .select('name destinationId')
          .exec((err, docs) => {
            callback1(err, docs);
          });
      },
      cities: (callback1) => {
        DbDestination.find({selectable: true, type: {$in: ['CITY', 'TOWN']}})
          .select(cols)
          .exec((err, docs) => {
            callback1(err, docs);
          });
      },
    },
    function(err, result) {
      const mState = {};
      _.each(result.states, (s) => {
        mState[String(s.destinationId)] = s.name;
      });
      // console.log('>>>>Model.getAllDestination mState', mState);
      const cities = _.map(result.cities, (c) => {
        const ids = c.lookupId.split('.');
        const sid = ids[ids.length - 2];
        return {
          name: c.name,
          location: c.location,
          destinationId: c.destinationId,
          state: mState[sid],
        };
      });
      // console.log('>>>>Model.getAllDestination result', cities);
      callback(err, cities);
    }
  );
};
const getAllProduct = (cityId, callback) => {
  // console.log('>>>>Model.getAllProduct', cityId);
  const cols =
    'productCode name shortTitle catIds subCatIds ' +
    'shortDescription duration thumbnailURL rating ' +
    'primaryDestinationName primaryDestinationId ' +
    'price currencyCode hotelPickup addrCheckIn tags';
  return DbProduct.find({primaryDestinationId: cityId})
    .select(cols)
    .exec((err, docs) => {
      callback(err, docs);
    });
};
const getAllAttraction = (cityId, callback) => {
  // console.log('>>>>Model.getAllAttraction', cityId);
  const cols =
    'name seoId description summary thumbnailURL ' +
    'rating attractionStreetAddress attractionCity ' +
    'primaryDestinationName primaryDestinationId ' +
    'attractionState tags';
  return DbAttraction.find({primaryDestinationId: cityId})
    .select(cols)
    .exec((err, docs) => {
      callback(err, docs);
    });
};
const getAllTagGroup = (input, callback) => {
  // console.log('>>>>Model.getAllTagGroup', input);
  const cols = 'name tags imgUrl';
  return DbTagGroup.find({selectable: true})
    .select(cols)
    .exec((err, docs) => {
      callback(err, docs);
    });
};
const getAllCategory = (input, callback) => {
  // console.log('>>>>Model.getAllCategory', input);
  async.parallel(
    {
      cats: (callback) => {
        const cols = 'name itemId thumbnailURL';
        return DbCategory.find({})
          .select(cols)
          .exec((err, docs) => {
            callback(err, docs);
          });
      },
      subcats: (callback) => {
        const cols = 'name itemId parentId';
        return DbSubCategory.find({})
          .select(cols)
          .exec((err, docs) => {
            callback(err, docs);
          });
      },
    },
    function(err, result) {
      let categories = [];
      if (!err) {
        const {cats, subcats} = result;
        categories = _.map(cats, (cat) => {
          return {
            name: cat.name,
            it: cat.itemId,
            subCategories: _.filter(subcats, (s) => {
              return s.parentId === cat.itemId;
            }),
          };
        });
        // console.log('>>>>Model.getAllCategory Result', categories);
      }
      callback(err, categories);
    }
  );
};
const getProductByName = (name, callback) => {
  // console.log('>>>>Model.getProductByName', name);
  const cols =
    'productCode name shortTitle catIds subCatIds ' +
    'primaryDestinationName primaryDestinationId ' +
    'shortDescription duration thumbnailURL rating ' +
    'price currencyCode hotelPickup addrCheckIn tags';
  return DbProduct.find({name: name})
    .select(cols)
    .exec((err, docs) => {
      callback(err, docs);
    });
};
const getAttractionByName = (name, callback) => {
  // console.log('>>>>Model.getAttractionByName', name);
  const cols =
    'name seoId description summary thumbnailURL ' +
    'rating attractionStreetAddress attractionCity ' +
    'primaryDestinationName primaryDestinationId ' +
    'attractionState tags';
  return DbAttraction.find({name: name})
    .select(cols)
    .exec((err, docs) => {
      callback(err, docs);
    });
};
const getAttractionByNameBlur = (keys, callback) => {
  // console.log('>>>>Model.getAttractionByName', keys);
  const rs = _.map(keys, (k) => {
    return {name: new RegExp(k, 'i')};
  });
  const cols =
    'name seoId description summary thumbnailURL ' +
    'rating attractionStreetAddress attractionCity ' +
    'primaryDestinationName primaryDestinationId ' +
    'attractionState';
  return DbAttraction.find({$and: rs})
    .select(cols)
    .exec((err, docs) => {
      callback(err, docs);
    });
};
const createPlan = (input, callback) => {
  // console.log('>>>>Model.createPlan', input);
  const inst = new DbTravelPlan(input);
  inst.save(callback);
};
const updatePlan = (plan, callback) => {
  // console.log('>>>>Model.updatePlan', plan);
  callback();
};
const createPlanDay = (input, callback) => {
  // console.log('>>>>Model.createPlanDay', input);
  if (Array.isArray(input)) {
    DbTravelPlanDay.insertMany(input, callback);
  } else {
    const day = new DbTravelPlanDay(input);
    day.save(callback);
  }
};
const updatePlanPeople = (input, callback) => {
  // console.log('>>>>Model.updatePlanPeople', input);
  const {senderId, planId, totalPeople} = input;
  async.parallel(
    {
      instance: (callback) => {
        const filter = {_id: planId};
        const doc = {
          totalPeople: totalPeople,
          updatedBy: senderId,
          updatedAt: new Date(),
        };
        return DbTravelPlan.updateOne(filter, doc, callback);
      },
      items: (callback) => {
        const filter = {travelPlan: planId};
        const doc = {
          totalPeople: totalPeople,
          updatedBy: senderId,
          updatedAt: new Date(),
        };
        return DbTravelPlanItem.updateMany(filter, doc, callback);
      },
    },
    function(err, res) {
      // console.log('>>>>Model.updatePlanPeople completed', {err, res});
    }
  );
};
const updatePlanDay = (day, callback) => {
  // console.log('>>>>Model.updatePlanDay', plan);
  callback();
};
const createPlanDayItem = (input, callback) => {
  console.log('>>>>Model.createPlanDayItem', input);
  if (Array.isArray(input)) {
    DbTravelPlanItem.insertMany(input, callback);
  } else {
    const item = new DbTravelPlanItem(input);
    item.save(callback);
  }
};
const updatePlanDayItem = (item, callback) => {
  // console.log('>>>>Model.updatePlanDayItem', plan);
  callback();
};
const updatePlanDayHotel = (input, callback) => {
  console.log('>>>>Model.updatePlanDayHotel', input);
  const {senderId, planId, dayNo, hotel} = input;
  const filter = {travelPlan: planId, dayNo: dayNo};
  const doc = {
    hotel: hotel,
    updatedBy: senderId,
    updatedAt: new Date(),
  };
  return DbTravelPlanDay.updateOne(filter, doc, callback);
};
const deletePlan = (filter, callback) => {
  return DbTravelPlan.deleteMany(filter, (err, docs) => {
    // console.log('>>>>Function [deletePlan] executed', {err, docs});
    if (callback) callback(err, docs);
  });
};
const deletePlanDay = (filter, callback) => {
  return DbTravelPlanDay.deleteMany(filter, (err, docs) => {
    // console.log('>>>>Function [deletePlanDay] executed', {err, docs});
    if (callback) callback(err, docs);
  });
};
const deletePlanItem = (filter, callback) => {
  return DbTravelPlanItem.deleteMany(filter, (err, docs) => {
    // console.log('>>>>Function [deletePlanItem] executed', {err, docs});
    if (callback) callback(err, docs);
  });
};
const findPlanDay = (filter, callback) => {
  return DbTravelPlanDay.find(filter, (err, docs) => {
    // console.log('>>>>Function [findPlanDay] executed', {err, docs});
    if (callback) callback(err, docs);
  });
};
const findPlan = (filter, callback) => {
  return DbTravelPlan.find(filter)
    .sort({updatedAt: 'desc'})
    .exec((err, docs) => {
      if (callback) callback(err, docs);
    });
};
const findFullPlan = (planId, callback) => {
  console.log('>>>>Function [findFullPlan]', planId);
  async.parallel(
    {
      instance: (callback) => {
        const filter = {_id: planId};
        return DbTravelPlan.find(filter, callback);
      },
      days: (callback) => {
        const filter = {travelPlan: planId};
        return DbTravelPlanDay.find(filter)
          .sort({dayNo: 'asc'})
          .exec((err, docs) => {
            if (callback) callback(err, docs);
          });
      },
      items: (callback) => {
        const filter = {travelPlan: planId};
        return DbTravelPlanItem.find(filter, callback);
      },
    },
    function(err, res) {
      console.log('>>>>Model.updatePlanPeople instance', res.instance);
      console.log('>>>>Model.updatePlanPeople days', res.days);
      console.log('>>>>Model.updatePlanPeople items', res.items);
      if (!err && res.instance && res.instance.length > 0) {
        const tmpPlan = res.instance[0];
        const mStartDate = moment(tmpPlan.startDate);
        const mEndDate = moment(tmpPlan.endDate);
        const plan = {
          _id: tmpPlan._id,
          tagGroups: tmpPlan.tagGroups,
          status: tmpPlan.status,
          startDate: tmpPlan.startDate,
          endDate: tmpPlan.endDate,
          totalDays: mEndDate.diff(mStartDate, 'days') + 1,
          startCity: tmpPlan.startCity,
          endCity: tmpPlan.endCity,
          totalPeople: tmpPlan.totalPeople,
          days: [],
        };
        _.each(res.days, (d) => {
          const day = {
            dayNo: d.dayNo,
            hotel: d.hotel,
            cities: d.cities,
            items: [],
          };
          const its = _.filter(res.items, (item) => {
            return d._id === item.travelPlanDay;
          });
          _.each(its, (it) => {
            day.items.push({
              itemType: it.itemType,
              itemId: it.itemId,
              totalPeople: it.totalPeople,
              unitPrice: it.unitPrice,
              destName: it.destName,
              name: it.name,
              imgUrl: it.imgUrl,
              isUserSelected: true,
            });
          });
          plan.days.push(day);
        });
      }
      callback(err, plan);
    }
  );
};
/* ============= Old Schemas ============= */
// Members
const scMember = new Schema({
  name: Schema.Types.String,
  profilePic: Schema.Types.String,
  loginId: Schema.Types.String,
  source: Schema.Types.String,
  email: Schema.Types.String,
  contactNumber: Schema.Types.String,
  linkedAccount: {type: [Schema.Types.ObjectId], ref: 'Member'},
  isActive: Schema.Types.Boolean,
});
const Member = mongoose.model('Member', scMember);
/* =========== Old Functions ============ */
// Member
const getUserByLoginId = (loginId, callback) => {
  console.log('>>>>Model.getUserByLoginId', loginId);
  return Member.findOne({loginId, isActive: true}).exec(callback);
};
const createUser = (user, callback) => {
  const member = new Member(user);
  member.save(callback);
};

export default {
  getUserByLoginId,
  createUser,
  // New Functions
  getAllDestination,
  getAllTagGroup,
  getAllCategory,
  getAllProduct,
  getAllAttraction,
  getProductByName,
  getAttractionByName,
  getAttractionByNameBlur,
  // Transactional Functions
  createPlan,
  createPlanDay,
  createPlanDayItem,
  updatePlan,
  updatePlanDay,
  updatePlanDayItem,
  updatePlanPeople,
  updatePlanDayHotel,
  deletePlan,
  deletePlanDay,
  deletePlanItem,
  findPlanDay,
  findPlan,
  findFullPlan,
};
