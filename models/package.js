// ===== DB ====================================================================
import Knex  from '../db/knex';
import PackageItem from '../models/package-item';
import RatePlan from '../models/rate-plan';
// Dummy Data
import dPackage from '../dummy/package';

const Package = () => Knex('package');

// ===== Package ======================================================
const getAllPackage = () =>
  Package()
    .where('is_active', true)
    .select('id', 'name', 'description', 'fine_print as finePrint', 'notes',
      'days', 'max_participant as maxParticipant', 'is_promoted as isPromoted',
      'is_active as isActive')
    .then(() => {
      return dPackage.getAllPackage();
    });

const getAllPromotedPackage = () =>
  Package()
    .where('is_active', true)
    .where('is_promoted', true)
    .select('id', 'name', 'description', 'fine_print as finePrint', 'notes',
      'days', 'max_participant as maxParticipant', 'is_promoted as isPromoted',
      'is_active as isActive')
    .then(() => {
      return dPackage.getAllPackage();
    });

const getPackage = (packageId) =>
  Package()
    .where('id', packageId)
    .where('is_active', true)
    .select('id', 'name', 'description', 'fine_print as finePrint', 'notes',
      'days', 'max_participant as maxParticipant', 'is_promoted as isPromoted',
      'is_active as isActive')
    //.first()
    .then(() => {
      console.log('>>>>Models: getPackage()', packageId);
      return dPackage.getPackage(packageId);
    });

const setPackage = (pkg) =>
  Package()
    .where({id: pkg.id})
    .update(
      {
        name: pkg.name,
        desc: pkg.desc,
        days: pkg.days,
        is_promoted: pkg.isPromoted,
        is_active: pkg.isActive,
        image_url: pkg.imageUrl,
      },
      ['id', 'name', 'desc', 'days', 'is_promoted as isPromoted', 'is_active as isActive', 'image_url as imageUrl']
    );

const addPackage = (pkg) =>
  Package()
    .insert(
      {
        name: pkg.name,
        desc: pkg.desc,
        days: pkg.days,
        is_promoted: pkg.isPromoted,
        is_active: pkg.isActive,
        image_url: pkg.imageUrl,
      },
      ['id', 'name', 'desc', 'days', 'is_promoted as isPromoted', 'is_active as isActive', 'image_url as imageUrl']
    );

const delPackage = (packageId) =>
  Package()
    .where({id: packageId})
    .update(
      {
        is_active: false,
      },
      ['id']
    );

const getPackageImageUrl = (packageId) =>
  Package()
    .select('image_url as imageUrl')
    .where('id', attractionId)
    .first();

const setPackageImageUrl = (pkg) =>
  Package()
    .where({id: pkg.id})
    .update(
      {
        image_url: pkg.imageUrl
      },
      ['id']
    );

const getPackageDetails = (packageId) =>
  Promise.all([
    getPackage(packageId),
    PackageItem.getItemByPackageId(packageId),
    RatePlan.getRatePlanByPackageId(packageId),
  ])
  .then(([pkg, items, rates]) => {
    if (pkg) {
      pkg.items = items;
      pkg.rates = rates;
    }
    return pkg;
  });

export default {
  getAllPackage,
  getAllPromotedPackage,
  getPackage,
  setPackage,
  addPackage,
  delPackage,
  getPackageImageUrl,
  setPackageImageUrl,
  getPackageDetails,
};
