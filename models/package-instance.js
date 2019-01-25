// ===== Module ================================================================
import _ from 'lodash';

// ===== DB ====================================================================
import Knex  from '../db/knex';
import Package from '../models/package';
import PackageImage from '../models/package-image';
import RatePlan from '../models/rate-plan';
import instItem from '../models/package-instance-item';
import instParticipant from '../models/package-instance-participant';

const dsInstPackage = () => Knex('package_inst');
const dsInstItem = () => Knex('package_inst_item');
const dsInstParticipant = () => Knex('package_inst_participant');
const dsAttraction = () => Knex('attraction');
const dsHotel = () => Knex('hotel');

// ===== Package ======================================================
const getInstPackage = (instId) =>
  dsInstPackage()
    .join('package', 'package.id', 'package_inst.pkg_id')
    .select('package_inst.id', 'package.id as packageId', 'package.name as name',
      'package.description as description', 'package_inst.start_date as startDate',
      'package_inst.end_date as endDate', 'package_inst.is_premium as isPremium',
      'package_inst.is_custom as isCustom', 'package_inst.cost as cost')
    .where('package_inst.id', instId)
    .first()
    .then((inst) => {
      //console.log('>>>>Calling getInstPackage', inst);
      return Promise.all([
        inst,
        PackageImage.getImageByPackageId(inst.packageId),
      ]).then(([inst, images]) => {
        inst.images = images;
        const coverPage = _.filter(images, {isCoverPage: true});
        inst.imageUrl = coverPage.length ? (coverPage[0].imageUrl) : '';
        //console.log('>>>>Before return getInstPackage', inst);
        return inst;
      });
    });

const getCitiesByInstId = (instId) => {
  return dsInstItem()
    .join('attraction', {'attraction.id': 'package_inst_item.attraction_id'})
    .join('city', {'city.id': 'attraction.city_id'})
    .distinct('city.id', 'city.name', 'city.description')
    .select()
    .where('package_inst_item.pkg_inst_id', instId);
};

const getCityHotelsByInstId = (instId) => {
  return dsInstItem()
    .join('attraction', {'attraction.id': 'package_inst_item.attraction_id'})
    .distinct('attraction.city_id')
    .select()
    .where('package_inst_item.pkg_inst_id', instId)
    .then((cities) => {
      const vCities = cities.map((city) => {return city.city_id;});
      return dsHotel()
        /*.join('hotel_image', {
          'hotel_image.hotel_id': 'hotel.id',
          'hotel_image.is_cover_page': Knex.raw('?', [true])})*/
        .join('city', {'city.id': 'hotel.city_id'})
        .select('city.name as cityName', 'hotel.id as id', 'hotel.name as name',
          'hotel.description as description'/*, 'hotel_image.image_url as imageUrl'*/)
        .whereIn('hotel.city_id', vCities)
        .then((result) => {
          console.log('>>>>InstPackage.getCityHotelsByInstId', result);
          return _.groupBy(result, (item) => item.cityName);
        });
    });
};

const getCityAttractionsByInstId = (instId) => {
  return dsInstItem()
    .join('attraction', {'attraction.id': 'package_inst_item.attraction_id'})
    .distinct('attraction.city_id')
    .select()
    .where('package_inst_item.pkg_inst_id', instId)
    .then((cities) => {
      const vCities = cities.map((city) => {return city.city_id;});
      return dsAttraction()
        .join('attraction_image', {
          'attraction_image.attraction_id': 'attraction.id',
          'attraction_image.is_cover_page': Knex.raw('?', [true])})
        .join('city', {'city.id': 'attraction.city_id'})
        .select('city.name as cityName', 'attraction.id as id', 'attraction.name as name',
          'attraction.description as description', 'attraction_image.image_url as imageUrl')
        .whereIn('attraction.city_id', vCities)
        .then((result) => {
          console.log('>>>>InstPackage.getCityAttractionsByInstId', result);
          return _.groupBy(result, (item) => item.cityName);
        });
    });
};

const getAttractionsByInstId = (instId) => {
  return dsInstItem()
    .join('attraction', {'attraction.id': 'package_inst_item.attraction_id'})
    .join('attraction_image', {
      'attraction_image.attraction_id': 'package_inst_item.attraction_id',
      'attraction_image.is_cover_page': Knex.raw('?', [true])})
    .join('city', {'city.id': 'attraction.city_id'})
    .select('city.name as cityName', 'attraction.id as id', 'attraction.name as name',
      'attraction.description as description', 'attraction_image.image_url as imageUrl')
    .where('package_inst_item.pkg_inst_id', instId)
    .then((result) => {
      console.log('>>>>InstPackage.getAttractionsByInstId[' + instId + ']', result);
      return _.groupBy(result, (item) => item.cityName);
    });
};

const getInstPackageDetails = (instId) =>
  Promise.all([
    getInstPackage(instId),
    //RatePlan.getRatePlanByInstId(instId),
    instItem.getInstItem(instId),
  ])
  .then(([inst, /*pkgRatePlans,*/ items]) => {
    inst.items = items;
    //pkgInst.rates = pkgRatePlans;
    console.log('>>>>Retrieved package instance', inst);
    return inst;
  });

const getLatestInstByUserId = (userId) =>
dsInstParticipant()
  .select('pkg_inst_id as instId')
  .where('login_id', userId)
  .orderBy('created_ts', 'desc')
  .first()
  .then((result) => {
    console.log(`getLatestInstByUserId(${userId}), found latest package instance`, result);
    return Promise.all([
      getInstPackage(result.instId),
      //RatePlan.getRatePlanByInstId(instId),
      instItem.getInstItem(result.instId),
    ])
    .then(([inst, /*pkgRatePlans,*/ items]) => {
      inst.items = items;
      //pkgInst.rates = pkgRatePlans;
      console.log('>>>>Retrieved package instance', inst);
      return inst;
    });
  });

const getLatestInstIdByUserId = (userId) =>
  dsInstParticipant()
    .select('pkg_inst_id as instId')
    .where('login_id', userId)
    .orderBy('created_ts', 'desc')
    .first();

const addInstPackage = (packageId) =>
  Promise.all([
    Package.getPackageDetails(packageId),
    dsInstPackage().insert({pkg_id: packageId}, ['id', 'pkg_id as packageId']),
  ])
  .then(([pkg, [instPackage]]) =>
    instItem.addInstItem(instPackage.id, pkg.items)
    .then(() =>
      getInstPackageDetails(instPackage.id)
    )
  );

const delInstPackage = (instId) =>
  Promise.all([
    instItem.delInstItem(instId),
    instParticipant.delParticipantByInstId(instId),
  ]).then(() => dsInstPackage().where('id', instId).del());

export default {
  getInstPackage,
  getInstPackageDetails,
  getLatestInstByUserId,
  getLatestInstIdByUserId,
  addInstPackage,
  delInstPackage,
  getAttractionsByInstId,
  getCitiesByInstId,
  getCityHotelsByInstId,
  getCityAttractionsByInstId,
};
