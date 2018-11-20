// ===== Module ================================================================
import _ from 'lodash';

// ===== DB ====================================================================
import Knex  from '../db/knex';
import Package from '../models/package';
import PackageImage from '../models/package-image';
import RatePlan from '../models/rate-plan';
import PackageInstItem from '../models/package-instance-item';
import PackageInstParticipant from '../models/package-instance-participant';

const PackageInst = () => Knex('package_inst');

// ===== Package ======================================================
const getPackageInstance = (instId) =>
  PackageInst()
    .select('id', 'pkg_id as packageId', 'start_date as startDate',
      'end_date as endDate', 'is_premium as isPremium',
      'is_custom as isCustom', 'pkg_fee as fee')
    .where('package_inst.id', instId)
    .first()
    .then((packageInst) => {
      //console.log('>>>>Calling getPackageInstance', packageInst);
      return Promise.all([
        packageInst,
        PackageImage.getImageByPackageId(packageInst.packageId),
      ]).then(([packageInst, images]) => {
        packageInst.images = images;
        //console.log('>>>>Before return getPackageInstance', packageInst);
        return packageInst;
      });
    });

const getAttractionsByInstId = (instId) => {
  return PackageInstItem()
    .join('attraction', {'attraction.id': 'package_inst_item.attraction_id'})
    .join('attraction_image', {
      'attraction_image.attraction_id': 'package_inst_item.attraction_id',
      'attraction_image.is_cover_page': Knex.raw('?', [true])})
    .join('city', {'city.id': 'attraction.city_id'})
    .select('city.name as cityName', 'attraction.id as id', 'attraction.name as name', 'attraction.description as description',
    'attraction_image.image_url as attractionImageUrl')
    .where('package_inst_item.pkg_inst_id', instId)
    .then((result) => {
      console.log('>>>>PackageInst.getAttractionsByInstId[' + instId + ']', result);
      return _.groupBy(result, (item) => item.cityName);
    });
};

const getPackageInstanceDetails = (instId) =>
  Promise.all([
    getPackageInstance(instId),
    //RatePlan.getRatePlanByInstId(instId),
    PackageInstItem.getPackageInstItem(instId),
  ])
  .then(([pkgInst, /*pkgRatePlans,*/ pkgInstItems]) => {
    pkgInst.items = pkgInstItems;
    //pkgInst.rates = pkgRatePlans;
    console.log('>>>>Retrieved package instance', pkgInst);
    return pkgInst;
  });

const addPackageInstance = (packageId) =>
  Promise.all([
    Package.getPackageDetails(packageId),
    PackageInst().insert({pkg_id: packageId}, ['id', 'pkg_id as packageId']),
  ])
  .then(([pkg, [packageInstance]]) =>
    PackageInstItem.addPackageInstItem(packageInstance.id, pkg.items)
    .then(() =>
      getPackageInstanceDetails(packageInstance.id)
    )
  )

const delPackageInstance = (packageInstId) =>
  Promise.all([
    PackageInstItem.delPackageInstItem(packageInstId),
    PackageInstParticipant.delParticipantByInstId(packageInstId),
  ]).then(() => PackageInst().where('id', packageInstId).del())

export default {
  getPackageInstance,
  getPackageInstanceDetails,
  addPackageInstance,
  delPackageInstance,
  getAttractionsByInstId,
};
