// ===== DB ====================================================================
import Knex  from '../db/knex';
import PackageItem from '../models/package-item';
import RatePlan from '../models/rate-plan';
import PackageImage from '../models/package-image';

const Package = () => Knex('package');

// ===== Package ======================================================
const getAllPackage = () =>
  Package()
    .join('package_image', {'package_image.pkg_id': 'package.id', 'package_image.is_cover_page': Knex.raw('?', [true])})
    .where('is_active', true)
    .select('id', 'name', 'description', 'fine_print as finePrint', 'notes',
      'days', 'max_participant as maxParticipant', 'is_promoted as isPromoted',
      'is_active as isActive', 'is_extention as isExtention',
      'package_image.image_url as imageUrl');

const getAllPromotedPackage = () =>
  Package()
    .where('is_active', true)
    .where('is_promoted', true)
    .select('id', 'name', 'description', 'fine_print as finePrint', 'notes',
      'days', 'max_participant as maxParticipant', 'is_promoted as isPromoted',
      'is_active as isActive', 'is_extention as isExtention');

const getPackage = (packageId) =>
  Package()
    .where('id', packageId)
    .where('is_active', true)
    .select('id', 'name', 'description', 'fine_print as finePrint', 'notes',
      'days', 'max_participant as maxParticipant', 'is_promoted as isPromoted',
      'is_active as isActive', 'is_extention as isExtention')
    .first();

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
    .update({is_active: false}, ['id']);

const getPackageDetails = (packageId) =>
  Promise.all([
    getPackage(packageId),
    PackageItem.getItemByPackageId(packageId),
    //RatePlan.getRatePlanByPackageId(packageId),
    PackageImage.getImageByPackageId(packageId),
  ])
  .then(([pkg, items/*, rates*/, images]) => {
    if (pkg) {
      pkg.items = items;
      pkg.images = images;
      //pkg.rates = rates;
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
  getPackageDetails,
};
