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
      'package.image_url as imageUrl')
    .where('package_inst.id', instId)
    .first()

const getPackageInstanceDetails = (instId) =>
  Promise.all([
      getPackageInstance(instId),
      RatePlan.getRatePlanByInstId(instId),
      PackageInstItem.getPackageInstItem(instId),
    ])
  .then(([pkgInst, pkgRatePlans, pkgInstItems]) => {
    pkgInst.items = pkgInstItems;
    pkgInst.rates = pkgRatePlans;

    console.log('>>>>Retrieved package instance', pkgInst);
    return pkgInst;
  })

const addPackageInstance = (packageId) =>
  Promise.all([
    Package.getPackageDetails(packageId),
    PackageInst().insert({pkg_id: packageId},['id', 'pkg_id as packageId', 'is_premium as isPremium']),
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
    PackageInstParticipant.delPackageParticipant(packageInstId),
  ]).then(() => PackageInst().where('id', packageInstId).del())

export default {
  getPackageInstance,
  getPackageInstanceDetails,
  addPackageInstance,
  delPackageInstance,
};