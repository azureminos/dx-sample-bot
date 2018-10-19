// ===== DB ====================================================================
import Knex  from '../db/knex';
import Package from '../models/package';
import RatePlan from '../models/rate-plan';
import PackageInstItem from '../models/package-instance-item';
import PackageInstParticipant from '../models/package-instance-participant';

const PackageInst = () => Knex('package_inst');

// ===== Package ======================================================
const getPackageInstance = (instId) =>
  PackageInst()
    .join('package', 'package.id', 'package_inst.pkg_id')
    .select('package_inst.id', 'package_inst.start_date as startDate','package_inst.is_premium as isPremium',
      'package_inst.pkg_fee as fee', 'package.name as name', 'package.desc as desc','package.days as days',
      'package.imageUrl as imageUrl')
    .where('package_inst.id', instId)

const getPackageInstanceDetails = (instId) =>
  Promise.all([
    getPackageInstance(instId),
    RatePlan.getRatePlanByInstId(instId),
    PackageInstItem.getPackageInstItem(instId),
    PackageInstParticipant.getPackageParticipant(instId),
    ])
  .then(([pkgInst, pkgInstItems, pkgRatePlans, pkgInstParticipants]) => {
    pkgInst.items = pkgInstItems;
    pkgInst.rates = pkgRatePlans;
    pkgInst.participants = pkgInstParticipants;

    return pkgInst;
  })

const addPackageInstance = (packageId, userId) =>
  Promise.all([
    Package.getPackageDetails(packageId),
    PackageInst().insert({pkg_id: packageId},['id', 'pkg_id as packageId', 'is_premium as isPremium']),
  ])
  .then(([pkg, [packageInstance]) => {
    console.log('>>>>Added package instance', packageInstance);
    console.log('>>>>Retrieved package', pkg);

    return Promise.all([
      PackageInstItem.addPackageInstItem(packageInstance.id, pkg.items, userId),
      PackageInstParticipant.addPackageParticipant(packageInstance.id, userId, true),
    ]).then(() =>
      getPackageInstanceDetails(packageInstance.id)
    );
  })

const delPackageInstance = (packageInstId) =>
  Promise.all([
    PackageInst().where('id', packageInstId).del(),
    PackageInstItem.delPackageInstItem(packageInstId),
    PackageInstParticipant.delPackageParticipant(packageInstId),
  ])

export default {
  getPackageInstance,
  getPackageInstanceDetails,
  addPackageInstance,
  delPackageInstance,
};
