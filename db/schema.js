import _ from 'lodash';
import async from 'async';
import mongoose from './mongoose';
import CONSTANTS from '../lib/constants';

const {Global, Instance} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const Schema = mongoose.Schema;

/* ============= Schemas ============= */
// Attraction
const scAttraction = new Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  city: {type: Schema.Types.ObjectId, ref: 'City'},
  image: Schema.Types.Object,
  cost: Schema.Types.Number,
  rate: Schema.Types.Number,
  timeTraffic: Schema.Types.Number,
  timeVisit: Schema.Types.Number,
  nearByAttractions: {type: [Schema.Types.ObjectId], ref: 'Attraction'},
  parentAttractions: {type: [Schema.Types.ObjectId], ref: 'Attraction'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const Attraction = mongoose.model('Attraction', scAttraction);
// Hotel
const scHotel = new mongoose.Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  city: {type: Schema.Types.ObjectId, ref: 'City'},
  stars: Schema.Types.Number,
  type: Schema.Types.String,
  defaultRate: Schema.Types.Number,
  rateExtraBed: Schema.Types.Number,
  image: Schema.Types.Object,
  timeTraffic: Schema.Types.Number,
  nearByAttractions: {type: [Schema.Types.ObjectId], ref: 'Attraction'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const Hotel = mongoose.model('Hotel', scHotel);
// Travel Package
const scTravelPackage = new Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  finePrint: Schema.Types.String,
  highlight: Schema.Types.String,
  // country: { type: Schema.Types.ObjectId, ref: 'Country' },
  totalDays: Schema.Types.Number,
  maxParticipant: Schema.Types.Number,
  minParticipant: Schema.Types.Number,
  departureDate: Schema.Types.String,
  retailPrice: Schema.Types.Number,
  isSnapshot: {type: Schema.Types.Boolean},
  status: Schema.Types.String,
  carOption: Schema.Types.String,
  isPromoted: Schema.Types.Boolean,
  isCustomisable: Schema.Types.Boolean,
  isExtention: Schema.Types.Boolean,
  image: Schema.Types.Object,
  titleImage: Schema.Types.Object,
  carouselImages: [Schema.Types.Object],
  effectiveTo: Schema.Types.Date,
  effectiveFrom: Schema.Types.Date,
  flightRates: {type: [Schema.Types.ObjectId], ref: 'FlightRate'},
  packageRates: {type: [Schema.Types.ObjectId], ref: 'PackageRate'},
  packageItems: {type: [Schema.Types.ObjectId], ref: 'PackageItem'},
  packageHotels: {type: [Schema.Types.ObjectId], ref: 'PackageHotel'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
scTravelPackage.virtual('startingPrice').get(function() {
  return 700;
});
const TravelPackage = mongoose.model('TravelPackage', scTravelPackage);
// Package Item
const scPackageItem = new Schema({
  package: {type: Schema.Types.ObjectId, ref: 'TravelPackage'},
  name: Schema.Types.String,
  description: Schema.Types.String,
  dayNo: Schema.Types.Number,
  daySeq: Schema.Types.Number,
  timePlannable: Schema.Types.Number,
  isMustVisit: Schema.Types.Boolean,
  attraction: {type: Schema.Types.ObjectId, ref: 'Attraction'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const PackageItem = mongoose.model('PackageItem', scPackageItem);
// Package Hotel
const scPackageHotel = new mongoose.Schema({
  package: {type: Schema.Types.ObjectId, ref: 'TravelPackage'},
  name: Schema.Types.String,
  description: Schema.Types.String,
  dayNo: Schema.Types.Number,
  isOvernight: Schema.Types.Boolean,
  hotel: {type: Schema.Types.ObjectId, ref: 'Hotel'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const PackageHotel = mongoose.model('PackageHotel', scPackageHotel);
// Flight Rate
const scFlightRate = new mongoose.Schema({
  package: {type: Schema.Types.ObjectId, ref: 'FlightRate'},
  name: Schema.Types.String,
  description: Schema.Types.String,
  airline: Schema.Types.String,
  type: Schema.Types.String,
  rangeFrom: Schema.Types.Date,
  rangeTo: Schema.Types.Date,
  rate: Schema.Types.Number,
  rateDomesticTotal: Schema.Types.Number,
  priority: Schema.Types.Number,
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const FlightRate = mongoose.model('FlightRate', scFlightRate);
// Package Rate
const scPackageRate = new mongoose.Schema({
  package: {type: Schema.Types.ObjectId, ref: 'TravelPackage'},
  name: Schema.Types.String,
  description: Schema.Types.String,
  premiumFee: Schema.Types.Number,
  minParticipant: Schema.Types.Number,
  maxParticipant: Schema.Types.Number,
  rate: Schema.Types.Number,
  rangeFrom: Schema.Types.Date,
  rangeTo: Schema.Types.Date,
  priority: Schema.Types.String,
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const PackageRate = mongoose.model('PackageRate', scPackageRate);
// Instance - Travel Package
const scInstPackage = new mongoose.Schema({
  package: {type: Schema.Types.ObjectId, ref: 'TravelPackage'},
  status: Schema.Types.String,
  startDate: Schema.Types.Date,
  endDate: Schema.Types.Date,
  carOption: Schema.Types.String,
  isCustomised: Schema.Types.Boolean,
  isCustomisable: Schema.Types.Boolean,
  totalDays: Schema.Types.Number,
  totalPeople: Schema.Types.Number,
  totalRooms: Schema.Types.Number,
  rate: Schema.Types.Number,
  items: [],
  hotels: [],
  members: [],
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const InstPackage = mongoose.model('InstPackage', scInstPackage);
// Instance - Package Item
const scInstPackageItem = new mongoose.Schema({
  instPackage: {type: Schema.Types.ObjectId, ref: 'InstPackage'},
  dayNo: Schema.Types.Date,
  daySeq: Schema.Types.Date,
  timePlannable: Schema.Types.Number,
  isMustVisit: Schema.Types.Boolean,
  attraction: {type: Schema.Types.ObjectId, ref: 'Attraction'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const InstPackageItem = mongoose.model('InstPackageItem', scInstPackageItem);
// Instance - Package Hotel
const scInstPackageHotel = new mongoose.Schema({
  instPackage: {type: Schema.Types.ObjectId, ref: 'InstPackage'},
  dayNo: Schema.Types.Date,
  isOvernight: Schema.Types.Boolean,
  hotel: {type: Schema.Types.ObjectId, ref: 'Hotel'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const InstPackageHotel = mongoose.model('InstPackageHotel', scInstPackageHotel);
// Instance - Package Member
const scInstPackageMember = new mongoose.Schema({
  instPackage: {type: Schema.Types.ObjectId, ref: 'InstPackage'},
  loginId: Schema.Types.String,
  isOwner: Schema.Types.Boolean,
  status: Schema.Types.String,
  people: Schema.Types.Number,
  rooms: Schema.Types.Number,
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const InstPackageMember = mongoose.model(
  'InstPackageMember',
  scInstPackageMember
);
/* =========== Functions ============ */
// Travel Package
const getAllPackages = () => {
  return TravelPackage.find();
};
const getFilteredPackages = (filter) => {
  return TravelPackage.find(filter);
};
const getPackageById = (id) => {
  return TravelPackage.findById(id);
};
// Package Item
const getItemsByPackageId = (packageId, callback) => {
  // console.log('>>>>Model >> PackageItem.getItemsByPackageId', packageId);
  const params = {package: new mongoose.Types.ObjectId(packageId)};
  PackageItem.find(params)
    .populate('attraction')
    .exec(callback);
};
// Package Hotel
const getHotelsByPackageId = (packageId, callback) => {
  // console.log('>>>>Model >> PackageHotel.getHotelsByPackageId', packageId);
  const params = {package: new mongoose.Types.ObjectId(packageId)};
  PackageHotel.find(params).exec(callback);
};
// Hotel
const getHotelsByIds = (ids) => {
  const input = _.filter(ids, (id) => {
    return !!id;
  });
  // console.log('>>>>Model >> Hotel.getHotelsByIds', input);
  return Hotel.find()
    .where('_id')
    .in(input);
};
// Flight Rate
const getFlightRatesByPackageId = (packageId) => {
  // console.log('>>>>Model.getFlightRatesByPackageId', packageId);
  const params = {package: new mongoose.Types.ObjectId(packageId)};
  return FlightRate.find(params);
};
// Package Rate
const getPackageRatesByPackageId = (packageId) => {
  // console.log('>>>>Model.getPackageRatesByPackageId', packageId);
  const params = {package: new mongoose.Types.ObjectId(packageId)};
  return PackageRate.find(params);
};
// Inst Package Items
const createInstanceItems = (items, callback) => {
  console.log('>>>>Model >> InstPackageItem.createInstanceItems', items);
  return InstPackageItem.insertMany(items, callback);
};
const deleteAllInstanceItems = () => {
  return InstPackageItem.remove({}, () => {
    console.log('>>>>Function [deleteAllInstanceItems] executed');
  });
};
// Inst Package Hotels
const createInstanceHotels = (hotels, callback) => {
  console.log('>>>>Model >> InstPackageHotel.createInstanceHotels', hotels);
  return InstPackageHotel.insertMany(hotels, callback);
};
const deleteAllInstanceHotels = () => {
  return InstPackageHotel.remove({}, () => {
    console.log('>>>>Function [deleteAllInstanceHotels] executed');
  });
};
// Inst Package Members
const createInstanceMembers = (members, callback) => {
  console.log('>>>>Model >> InstPackageMember.createInstanceMembers', members);
  return InstPackageMember.insertMany(members, callback);
};
const deleteAllInstanceMembers = () => {
  return InstPackageMember.remove({}, () => {
    console.log('>>>>Function [deleteAllInstanceMembers] executed');
  });
};
// Inst Package
const getLatestInstByUserId = (userId, callback) => {
  const params = {createdBy: userId};
  const select = '_id';
  const options = {sort: {createdAt: -1}};
  InstPackage.findOne(params, select, options).exec(callback);
};
const getInstSummaryById = (instId, callback) => {
  InstPackage.findById(instId)
    .populate({
      path: 'package',
      model: 'TravelPackage',
      /* populate: {
        path: 'image',
      },*/
    })
    .exec(callback);
};
const createInstance = (inst, callback) => {
  const instPackage = new InstPackage(inst);
  instPackage.save(callback);
};
const createInstanceByPackageId = (request, handler) => {
  console.log('>>>>Modal.createInstanceByPackageId', request);
  const {packageId, user, isCustomised} = request;
  const now = new Date();
  const createdBy = user ? user.id : Global.sysUser;
  const instance = {
    status: InstanceStatus.INITIATED,
    package: packageId,
    isCustomised: isCustomised,
    rate: 0,
    totalPeople: 0,
    totalRooms: 0,
    createdBy: createdBy,
    createdAt: now,
  };
  const handleInstance = (err, inst) => {
    if (err) return console.log(err);
    console.log('>>>>Instance Created', inst);

    return async.parallel(
      {
        items: (callback) => {
          getItemsByPackageId(packageId, (err, items) => {
            console.log(`>>>>Model.getItemsByPackageId [${packageId}]`, items);
            const iItems = _.map(items, (item) => {
              const iItem = {
                instPackage: inst._id,
                dayNo: item.dayNo,
                daySeq: item.daySeq,
                timePlannable: item.timePlannable,
                isMustVisit: item.isMustVisit,
                attraction: item.attraction,
                createdBy: createdBy,
                createdAt: now,
              };
              return iItem;
            });
            return createInstanceItems(iItems, function(err, docs) {
              console.log('>>>>Model.createInstanceItems', docs);
              return callback(null, docs);
            });
          });
        },
        hotels: (callback) => {
          getHotelsByPackageId(packageId, (err, hotels) => {
            console.log(
              `>>>>Model.getHotelsByPackageId [${packageId}]`,
              hotels
            );
            const iHotels = _.map(hotels, (hotel) => {
              const iHotel = {
                instPackage: inst._id,
                dayNo: hotel.dayNo,
                isOvernight: hotel.isOvernight,
                hotel: hotel.hotel,
                createdBy: createdBy,
                createdAt: now,
              };
              return iHotel;
            });
            return createInstanceHotels(iHotels, function(err, docs) {
              console.log('>>>>Model.createInstanceHotels', docs);
              return callback(null, docs);
            });
          });
        },
        members: (callback) => {
          if (user) {
            const instanceMember = [
              {
                instPackage: inst._id,
                loginId: createdBy,
                createdBy: createdBy,
                createdAt: now,
                people: 0,
                rooms: 0,
                isOwner: true,
                status: InstanceStatus.INITIATED,
              },
            ];
            const instanceMembers = [instanceMember];

            return createInstanceMembers(instanceMembers, function(err, docs) {
              console.log('>>>>Model.createInstanceMembers', docs);
              return callback(null, docs);
            });
          }
          return callback(null, []);
        },
      },
      function(err, results) {
        console.log('>>>>Instance Saved', {err, results});
        handler({err, results});
        /* const inst = {...doc._doc};
        inst.items = results.items;
        inst.hotels = results.hotels;
        inst.members = results.members;
        socket.emit('product:customise', inst); */
      }
    );
  };
  createInstance(instance, handleInstance);
};
const updateInstanceStatus = (params, callback) => {
  const filter = {_id: params.id};
  const doc = {
    status: params.status,
    updatedBy: params.user,
    updatedAt: new Date(),
  };
  return InstPackage.updateOne(filter, doc, callback);
};
const deleteAllInstances = () => {
  return InstPackage.remove({}, () => {
    console.log('>>>>Function [deleteAllInstances] executed');
  });
};

export default {
  getInstSummaryById,
  getLatestInstByUserId,
  getPackageById,
  getAllPackages,
  getFilteredPackages,
  getItemsByPackageId,
  getHotelsByIds,
  getHotelsByPackageId,
  getFlightRatesByPackageId,
  getPackageRatesByPackageId,
  createInstance,
  createInstanceByPackageId,
  createInstanceItems,
  createInstanceHotels,
  createInstanceMembers,
  updateInstanceStatus,
  deleteAllInstances,
  deleteAllInstanceItems,
  deleteAllInstanceHotels,
  deleteAllInstanceMembers,
};
