// ===== Module ================================================================
import _ from 'lodash';

// ===== DB ====================================================================
import Knex  from '../db/knex';
import Package from '../models/package';
import RatePlan from '../models/rate-plan';
import PackageInstItem from '../models/package-instance-item';
import PackageInstParticipant from '../models/package-instance-participant';
// Dummy Data
import dPackage from '../dummy/package';

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
      const p = dPackage.getPackage(packageInst.packageId);
      packageInst.packageName = p.name;
      packageInst.description = p.description;
      packageInst.days = p.days;
      packageInst.finePrint = p.finePrint;
      packageInst.maxParticipant = p.maxParticipant;
      return packageInst;
    });

const getAttractionsByInstId = (instId) => {
  return PackageInst()
    .join('package_item', {'package_item.pkg_id': 'package_inst.pkg_id'})
    .join('attraction', {'attraction.id': 'package_item.attraction_id'})
    .join('city', {'city.id': 'attraction.city_id'})
    .select('city.name as cityName', 'attraction.id as id', 'attraction.name as name', 'attraction.desc as desc',
      'attraction.image_url as imageUrl')
    .where('package_inst.id', instId)
    .then((result) => {
      console.log('>>>>PackageInst.getAttractionsByInstId['+instId+']', result);
      return _.groupBy(result, (item) => item.cityName);
    });
}

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
  })

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
