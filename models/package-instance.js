// ===== DB ====================================================================
import Knex  from '../db/knex';
import Package from '../models/package';

const PackageInst = () => Knex('package_inst');
const PackageInstItem = () => Knex('package_inst_item');
const PackageParticipant = () => Knex('package_participant');

// ===== Package ======================================================
const addPackageInstance = (packageId, userId) =>
  Package
    .getPackageDetails(packageId)
    .then((pkg) => {
      PackageInst()
        .insert(
          {
            pkg_id: pkg.id,
          },
          ['id', 'pkg_id as packageId', 'is_premium as isPremium']
        ).then(([packageInst]) => {
          console.log('>>>>package instance added', packageInst);
        })
    });

const delPackageInstance = (packageInstId) =>
  Promise.all([
    PackageInst().where('id', packageInstId).del(),
    PackageInstItem().where('pkg_inst_id', packageInstId).del(),
    PackageParticipant().where('pkg_inst_id', packageInstId).del(),
  ])

export default {
  addPackageInstance,
  delPackageInstance,
};
