import _ from 'lodash';
import async from 'async';
import mongoose from './mongoose';
import CONSTANTS from '../lib/constants';

const {Global, User, Instance} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const UserSource = User.Source;
const Schema = mongoose.Schema;

/* ============= Schemas ============= */
// City
const scCity = new Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  attractions: {type: [Schema.Types.ObjectId], ref: 'Attraction'},
  hotels: {type: [Schema.Types.ObjectId], ref: 'Hotel'},
  carRates: {type: [Schema.Types.ObjectId], ref: 'CarRate'},
});
const City = mongoose.model('City', scCity);
// City
const scCarRate = new Schema({
  city: {type: [Schema.Types.ObjectId], ref: 'City'},
  type: Schema.Types.String,
  minParticipant: Schema.Types.Number,
  maxParticipant: Schema.Types.Number,
  rangeFrom: Schema.Types.Date,
  rangeTo: Schema.Types.Date,
  rate: Schema.Types.Number,
  rateLocalGuide: Schema.Types.Number,
  rateAirport: Schema.Types.Number,
  rateExtra: Schema.Types.Number,
  priority: Schema.Types.Number,
});
const CarRate = mongoose.model('CarRate', scCarRate);
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
  dayNo: Schema.Types.Number,
  daySeq: Schema.Types.Number,
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
  dayNo: Schema.Types.Number,
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
  name: Schema.Types.String,
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
const format = (input) => {
  const parseObj = (item) => {
    if (item) {
      const source = {...item};
      const nItem = {...source._doc};
      nItem.id = item._id;
      if (item.image) {
        nItem.imageUrl = item.image.secure_url || '';
      }
      if (item.attraction && !(item.attraction instanceof String)) {
        nItem.cityId = item.attraction.city;
        const attraction = {
          id: item.attraction._id,
          name: item.attraction.name,
          city: item.attraction.city,
          timeTraffic: item.attraction.timeTraffic,
          timeVisit: item.attraction.timeVisit,
        };
        if (item.attraction.image) {
          attraction.imageUrl = item.attraction.image.secure_url || '';
        }
        nItem.attraction = attraction;
      }
      if (item.hotel && !(item.hotel instanceof String)) {
        nItem.cityId = item.hotel.city;
        const hotel = {
          id: item.hotel._id,
          name: item.hotel.name,
          city: item.hotel.city,
          type: item.hotel.type,
          stars: item.hotel.stars,
        };
        if (item.hotel.image) {
          hotel.imageUrl = item.hotel.image.secure_url || '';
        }
        nItem.hotel = hotel;
      }
      return nItem;
    }
    return item;
  };
  if (Array.isArray(input)) {
    const rs = [];
    _.each(input, function(item) {
      rs.push(parseObj(item));
    });
    return rs;
  }
  return parseObj(input);
};
// Travel Package
const selectPackage =
  'id departureDate description name effectiveTo effectiveFrom ' +
  'highlight finePrint titleImage.secure_url image.secure_url ' +
  'isExtention isCustomisable isPromoted totalDays additionalField';
const getAllPackages = (callback) => {
  console.log('>>>>Model.getAllPackages');
  return TravelPackage.find()
    .select(selectPackage)
    .exec((err, docs) => {
      callback(err, format(docs));
    });
};
const getFilteredPackages = (filter, callback) => {
  console.log('>>>>Model.getFilteredPackages', filter);
  return TravelPackage.find(filter)
    .select(selectPackage)
    .exec((err, docs) => {
      callback(err, format(docs));
    });
};
const getPackageById = (id, callback) => {
  console.log('>>>>Model.getPackageById', id);
  return TravelPackage.findById(id)
    .select(selectPackage)
    .exec((err, docs) => {
      callback(err, format(docs));
    });
};
// Package Item
const getItemsByPackageId = (packageId, callback) => {
  console.log('>>>>Model.getItemsByPackageId', packageId);
  const params = {package: packageId};
  PackageItem.find(params)
    .populate({
      path: 'attraction',
      model: 'Attraction',
    })
    .exec((err, docs) => {
      callback(err, format(docs));
    });
};
// Package Hotel
const getHotelsByPackageId = (packageId, callback) => {
  console.log('>>>>Model.getHotelsByPackageId', packageId);
  const params = {package: new mongoose.Types.ObjectId(packageId)};
  PackageHotel.find(params)
    .populate({
      path: 'hotel',
      model: 'Hotel',
    })
    .exec((err, docs) => {
      callback(err, format(docs));
    });
};
// Hotel
const getHotelsByIds = (ids, callback) => {
  const input = _.filter(ids, (id) => {
    return !!id;
  });
  // console.log('>>>>Model >> Hotel.getHotelsByIds', input);
  return Hotel.find({_id: {$in: input}}).exec((err, docs) => {
    callback(err, format(docs));
  });
};
// Flight Rate
const getFlightRatesByPackageId = (packageId, callback) => {
  console.log('>>>>Model.getFlightRatesByPackageId', packageId);
  const params = {package: new mongoose.Types.ObjectId(packageId)};
  return FlightRate.find(params).exec((err, docs) => {
    callback(err, format(docs));
  });
};
// Package Rate
const getPackageRatesByPackageId = (packageId, callback) => {
  console.log('>>>>Model.getPackageRatesByPackageId', packageId);
  const params = {package: new mongoose.Types.ObjectId(packageId)};
  return PackageRate.find(params).exec(callback);
};
// Package City
const getCitiesByPackageId = (packageId, callback) => {
  console.log('>>>>Model.getCitiesByPackageId', packageId);
  getItemsByPackageId(packageId, (err, docs) => {
    const tmpCities = _.map(docs, (item) => {
      return item.cityId;
    });
    const allCities = _.filter(tmpCities, (city) => {
      return !!city;
    });
    City.find({_id: {$in: allCities}})
      .populate([
        {path: 'attractions', model: 'Attraction'},
        {path: 'carRates', model: 'CarRate'},
        {path: 'hotels', model: 'Hotel'},
      ])
      .exec((err, docs) => {
        callback(err, format(docs));
      });
  });
};
// Inst Package Items
const getInstanceItemsByInstId = (instId, callback) => {
  console.log('>>>>Model.getInstanceItemsByInstId', instId);
  const params = {instPackage: new mongoose.Types.ObjectId(instId)};
  return InstPackageItem.find(params).exec((err, docs) => {
    console.log('>>>>Model.getInstanceItemsByInstId before', docs);
    console.log('>>>>Model.getInstanceItemsByInstId after', format(docs));
    callback(err, format(docs));
  });
};
const createInstanceItems = (items, callback) => {
  console.log('>>>>Model.createInstanceItems', items);
  return InstPackageItem.insertMany(items, (err, docs) => {
    callback(err, format(docs));
  });
};
const deleteAllInstanceItems = () => {
  return InstPackageItem.remove({}, () => {
    console.log('>>>>Function [deleteAllInstanceItems] executed');
  });
};
// Inst Package Hotels
const getInstanceHotelsByInstId = (instId, callback) => {
  console.log('>>>>Model.getInstanceHotelsByInstId', instId);
  const params = {instPackage: new mongoose.Types.ObjectId(instId)};
  return InstPackageHotel.find(params).exec((err, docs) => {
    callback(err, format(docs));
  });
};
const createInstanceHotels = (hotels, callback) => {
  console.log('>>>>Model.createInstanceHotels', hotels);
  return InstPackageHotel.insertMany(hotels, (err, docs) => {
    callback(err, format(docs));
  });
};
const deleteAllInstanceHotels = () => {
  return InstPackageHotel.remove({}, () => {
    console.log('>>>>Function [deleteAllInstanceHotels] executed');
  });
};
// Inst Package Members
const getInstanceMembersByInstId = (instId, callback) => {
  console.log('>>>>Model.getInstanceMembersByInstId', instId);
  const params = {instPackage: new mongoose.Types.ObjectId(instId)};
  return InstPackageMember.find(params).exec((err, docs) => {
    callback(err, format(docs));
  });
};
const createInstanceMembers = (members, callback) => {
  console.log('>>>>Model.createInstanceMembers', members);
  return InstPackageMember.insertMany(members, (err, docs) => {
    callback(err, format(docs));
  });
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
  InstPackage.findOne(params, select, options).exec((err, docs) => {
    callback(err, format(docs));
  });
};
const getInstanceByInstId = (instId, callback) => {
  InstPackage.findById(instId)
    .populate({
      path: 'package',
      model: 'TravelPackage',
    })
    .exec((err, docs) => {
      callback(err, format(docs));
    });
};
const createInstance = (inst, callback) => {
  const instPackage = new InstPackage(inst);
  instPackage.save((err, docs) => {
    callback(err, format(docs));
  });
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
        instance: (callback) => {
          callback(err, inst);
        },
        items: (callback) => {
          getItemsByPackageId(packageId, (err, items) => {
            console.log(`>>>>Model.getItemsByPackageId [${packageId}]`, items);
            const iItems = _.map(items, (item) => {
              const iItem = {
                instPackage: inst.id,
                dayNo: item.dayNo,
                daySeq: item.daySeq,
                timePlannable: item.timePlannable,
                isMustVisit: item.isMustVisit,
                createdBy: createdBy,
                createdAt: now,
              };
              if (item.attraction) {
                iItem.attraction = item.attraction.id;
              }
              return iItem;
            });
            return createInstanceItems(iItems, function(err, docs) {
              console.log('>>>>Model.createInstanceItems', docs);
              return callback(null, format(docs));
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
                instPackage: inst.id,
                dayNo: hotel.dayNo,
                isOvernight: hotel.isOvernight,
                createdBy: createdBy,
                createdAt: now,
              };
              if (hotel.hotel) {
                iHotel.hotel = hotel.hotel.id;
              }
              return iHotel;
            });
            return createInstanceHotels(iHotels, function(err, docs) {
              console.log('>>>>Model.createInstanceHotels', docs);
              return callback(null, format(docs));
            });
          });
        },
        members: (callback) => {
          if (user) {
            const instanceMember = [
              {
                instPackage: inst.id,
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
              return callback(null, format(docs));
            });
          }
          return callback(null, []);
        },
      },
      function(err, results) {
        console.log('>>>>Instance Saved', {err, results});
        handler({err, results});
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
  getPackageById,
  getAllPackages,
  getFilteredPackages,
  getItemsByPackageId,
  getHotelsByIds,
  getHotelsByPackageId,
  getFlightRatesByPackageId,
  getPackageRatesByPackageId,
  getCitiesByPackageId,
  getLatestInstByUserId,
  getInstanceByInstId,
  getInstanceItemsByInstId,
  getInstanceHotelsByInstId,
  getInstanceMembersByInstId,
  createInstanceByPackageId,
  createInstance,
  createInstanceItems,
  createInstanceHotels,
  createInstanceMembers,
  updateInstanceStatus,
  deleteAllInstances,
  deleteAllInstanceItems,
  deleteAllInstanceHotels,
  deleteAllInstanceMembers,
};
