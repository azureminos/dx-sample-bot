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
const dsAttraction = () => Knex('attraction');
// ===== Package ======================================================
const getInstPackage = (instId) =>
  dsInstPackage()
    .join('package', 'package.id', 'package_inst.pkg_id')
    .select('package_inst.id', 'package.id as packageId', 'package.name as name',
      'package.description as description', 'package_inst.start_date as startDate',
      'package_inst.end_date as endDate', 'package_inst.is_premium as isPremium',
      'package_inst.is_custom as isCustom', 'package_inst.pkg_fee as fee')
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

const getCityAttractionsByInstId = (instId) => {
  return dsInstItem()
    .join('attraction', {'attraction.id': 'package_inst_item.attraction_id'})
    .distinct('attraction.city_id')
    .select()
    .where('package_inst_item.pkg_inst_id', instId)
    .then((cities) => {
      console.log('>>>>getCityAttractionsByInstId, all city ids', cities);
      const vCities = _.values(cities);
      return dsAttraction()
        .join('attraction_image', {
          'attraction_image.attraction_id': 'attraction.id',
          'attraction_image.is_cover_page': Knex.raw('?', [true])})
        .join('city', {'city.id': 'attraction.city_id'})
        .select('city.name as cityName', 'attraction.id as id', 'attraction.name as name',
          'attraction.description as description', 'attraction_image.image_url as imageUrl')
        .whereIn('attraction.city_id', vCities);
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
  addInstPackage,
  delInstPackage,
  getAttractionsByInstId,
  getCityAttractionsByInstId,
};
