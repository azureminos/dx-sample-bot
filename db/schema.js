import _ from 'lodash';
import async from 'async';
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
const dbCountry = mongoose.model('RefCountry', nCountry);
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
const dbDestination = mongoose.model('RefDestination', nDestination);
// Reference   - TagGroup
const nTagGroup = new Schema({
  name: Schema.Types.String,
  tags: [Schema.Types.String],
});
const dbTagGroup = mongoose.model('RefTagGroup', nTagGroup);
// Reference   - Category
const nCategory = new Schema({
  name: Schema.Types.String,
  itemId: Schema.Types.Number,
  thumbnailURL: Schema.Types.String,
  thumbnailHiResURL: Schema.Types.String,
});
const dbCategory = mongoose.model('RefCategory', nCategory);
// Reference   - SubCategory
const nSubCategory = new Schema({
  name: Schema.Types.String,
  itemId: Schema.Types.Number,
  parentId: Schema.Types.Number,
});
const dbSubCategory = mongoose.model('RefSubCategory', nSubCategory);
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
  tag: [Schema.Types.String],
});
const dbProduct = mongoose.model('RefProduct', nProduct);
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
  tag: [Schema.Types.String],
});
const dbAttraction = mongoose.model('RefAttraction', nAttraction);
// Reference   - Day Plan
const nDayPlan = new Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  type: Schema.Types.String,
  startCityId: Schema.Types.Number,
  endCityId: Schema.Types.Number,
  otherCityIds: [Schema.Types.Number],
  notes: Schema.Types.String,
});
const dbDayPlan = mongoose.model('RefDayPlan', nDayPlan);
// Reference   - Day Plan Item
const nDayPlanItem = new Schema({
  dayPlan: {type: Schema.Types.ObjectId, ref: 'RefDayPlan'},
  daySeq: Schema.Types.Number,
  itemType: Schema.Types.String,
  itemId: Schema.Types.String,
  notes: Schema.Types.String,
});
const dbDayPlanItem = mongoose.model('RefDayPlanItem', nDayPlanItem);
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
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const dbTravelPlan = mongoose.model('TravelPlan', nTravelPlan);
// Transaction - Travel Plan Day
const nTravelPlanDay = new mongoose.Schema({
  travelPlan: {type: Schema.Types.ObjectId, ref: 'TravelPlan'},
  dayNo: Schema.Types.Number,
  cities: Schema.Types.Mixed,
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const dbTravelPlanDay = mongoose.model('TravelPlanDay', nTravelPlanDay);
// Transaction - Travel Plan Item
const nTravelPlanItem = new mongoose.Schema({
  travelPlanDay: {type: Schema.Types.ObjectId, ref: 'TravelPlanDay'},
  daySeq: Schema.Types.Number,
  itemType: Schema.Types.String,
  itemId: Schema.Types.String,
  totalPeople: Schema.Types.Number,
  unitPrice: Schema.Types.Number,
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const dbTravelPlanItem = mongoose.model('TravelPlanItem', nTravelPlanItem);
/* ============= New Functions ============= */
const getAllDestination = (country, callback) => {
  console.log('>>>>Model.getAllDestination', country);
  const cols = 'name description location destinationId type lookupId';
  async.parallel(
    {
      states: (callback1) => {
        dbDestination
          .find({type: 'REGION'})
          .select('name destinationId')
          .exec((err, docs) => {
            callback1(err, docs);
          });
      },
      cities: (callback1) => {
        dbDestination
          .find({selectable: true, type: {$in: ['CITY', 'TOWN']}})
          .select(cols)
          .exec((err, docs) => {
            callback1(err, docs);
          });
      },
    },
    function(err, result) {
      console.log('>>>>Model.getAllDestination result', result);
      const mState = {};
      _.each(result.states, (s) => {
        mState[String(s.destinationId)] = s.name;
      });
      _.map(result.cities, (c) => {
        const ids = c.lookupId.split(',');
        const sid = ids[ids.length - 2];
        return {...c, state: mState[sid]};
      });
    }
  );
};
const getAllProduct = (cityId, callback) => {
  console.log('>>>>Model.getAllProduct', cityId);
  const cols =
    'productCode name shortTitle catIds subCatIds ' +
    'shortDescription duration thumbnailURL rating ' +
    'primaryDestinationName primaryDestinationId ' +
    'price currencyCode hotelPickup addrCheckIn tags';
  return dbProduct
    .find({primaryDestinationId: cityId})
    .select(cols)
    .exec((err, docs) => {
      callback(err, docs);
    });
};
const getAllAttraction = (cityId, callback) => {
  console.log('>>>>Model.getAllAttraction', cityId);
  const cols =
    'name seoId description summary thumbnailURL ' +
    'rating attractionStreetAddress attractionCity ' +
    'primaryDestinationName primaryDestinationId ' +
    'attractionState tags';
  return dbAttraction
    .find({primaryDestinationId: cityId})
    .select(cols)
    .exec((err, docs) => {
      callback(err, docs);
    });
};
const getAllTagGroup = (input, callback) => {
  console.log('>>>>Model.getAllTagGroup', input);
  const cols = 'name tags imgUrl';
  return dbTagGroup
    .find({selectable: true})
    .select(cols)
    .exec((err, docs) => {
      callback(err, docs);
    });
};
const getAllCategory = (input, callback) => {
  console.log('>>>>Model.getAllCategory', input);
  async.parallel(
    {
      cats: (callback) => {
        const cols = 'name itemId thumbnailURL';
        return dbCategory
          .find({})
          .select(cols)
          .exec((err, docs) => {
            callback(err, docs);
          });
      },
      subcats: (callback) => {
        const cols = 'name itemId parentId';
        return dbSubCategory
          .find({})
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
        console.log('>>>>Model.getAllCategory Result', categories);
      }
      callback(err, categories);
    }
  );
};
const getProductByName = (name, callback) => {
  console.log('>>>>Model.getProductByName', name);
  const cols =
    'productCode name shortTitle catIds subCatIds ' +
    'primaryDestinationName primaryDestinationId ' +
    'shortDescription duration thumbnailURL rating ' +
    'price currencyCode hotelPickup addrCheckIn ';
  return dbProduct
    .find({name: name})
    .select(cols)
    .exec((err, docs) => {
      callback(err, docs);
    });
};
const getAttractionByName = (name, callback) => {
  console.log('>>>>Model.getAttractionByName', name);
  const cols =
    'name seoId description summary thumbnailURL ' +
    'rating attractionStreetAddress attractionCity ' +
    'primaryDestinationName primaryDestinationId ' +
    'attractionState';
  return dbAttraction
    .find({name: name})
    .select(cols)
    .exec((err, docs) => {
      callback(err, docs);
    });
};
const getAttractionByNameBlur = (keys, callback) => {
  console.log('>>>>Model.getAttractionByName', keys);
  const rs = _.map(keys, (k) => {
    return {name: new RegExp(k, 'i')};
  });
  const cols =
    'name seoId description summary thumbnailURL ' +
    'rating attractionStreetAddress attractionCity ' +
    'primaryDestinationName primaryDestinationId ' +
    'attractionState';
  return dbAttraction
    .find({$and: rs})
    .select(cols)
    .exec((err, docs) => {
      callback(err, docs);
    });
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
};
