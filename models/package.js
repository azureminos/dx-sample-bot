// ===== DB ====================================================================
import Knex  from '../db/knex';
import PackageItem from '../models/package-item';
import PackageImage from '../models/package-image';

const Package = () => Knex('package');

// ===== Package ======================================================
const getAllPackage = () =>
  Package()
    .join('package_image', {'package_image.pkg_id': 'package.id', 'package_image.is_cover_page': Knex.raw('?', [true])})
    .where('is_active', true)
    .select('package.id', 'name', 'description', 'fine_print as finePrint', 'notes',
      'days', 'max_participant as maxParticipant', 'is_promoted as isPromoted',
      'is_active as isActive', 'is_extention as isExtention',
      'package_image.image_url as imageUrl');

const getAllPromotedPackage = () =>
  Package()
    .join('package_image', {'package_image.pkg_id': 'package.id', 'package_image.is_cover_page': Knex.raw('?', [true])})
    .where({'is_active': true, 'is_promoted': true})
    .select('package.id', 'name', 'description', 'fine_print as finePrint', 'notes',
      'days', 'max_participant as maxParticipant', 'is_promoted as isPromoted',
      'is_active as isActive', 'is_extention as isExtention',
      'package_image.image_url as imageUrl');

const getPackage = (packageId) =>
  Package()
    .where('package.id', packageId)
    .where('package.is_active', true)
    .join('package_image', {'package_image.pkg_id': 'package.id', 'package_image.is_cover_page': Knex.raw('?', [true])})
    .select('package.id', 'name', 'description', 'fine_print as finePrint', 'notes',
      'days', 'max_participant as maxParticipant', 'is_promoted as isPromoted',
      'is_active as isActive', 'is_extention as isExtention',
      'package_image.image_url as imageUrl');

const updatePackage = (pkg) =>
  Package()
    .where({id: pkg.id})
    .update(
      {
        name: pkg.name,
        description: pkg.description,
        fine_print: pkg.finePrint,
        notes: pkg.notes,
        days: pkg.days,
        max_participant: pkg.maxParticipant,
        is_promoted: pkg.isPromoted,
        is_extention: pkg.isExtention,
        is_active: pkg.isActive,
      },
      ['package.id', 'name', 'description', 'fine_print as finePrint', 'notes',
      'days', 'max_participant as maxParticipant', 'is_promoted as isPromoted',
      'is_active as isActive', 'is_extention as isExtention']
    )
    .then(([result]) => {return result;});

const setPackage = (p) => {
  return Promise.all([
    updatePackage(p),
    PackageImage.updatePackageImage(p),
  ])
  .then(([pkg, image]) => {
    pkg.imageUrl = image.imageUrl;
    return pkg;
  });
};

const insertPackage = (pkg) =>
  Package()
    .insert(
      {
        name: pkg.name,
        description: pkg.description,
        fine_print: pkg.finePrint,
        notes: pkg.notes,
        days: pkg.days,
        max_participant: pkg.maxParticipant,
        is_promoted: pkg.isPromoted,
        is_extention: pkg.isExtention,
        is_active: pkg.isActive,
      },
      ['package.id', 'name', 'description', 'fine_print as finePrint', 'notes',
      'days', 'max_participant as maxParticipant', 'is_promoted as isPromoted',
      'is_active as isActive', 'is_extention as isExtention']
    )
    .then(([result]) => {return result;});

const addPackage = (item) => {
  return insertPackage(item)
    .then((pkg) => {
      return Promise.all([
        pkg,
        PackageImage.insertPackageImage(pkg),
      ])
      .then(([pkg, image]) => {
        pkg.imageUrl = image.imageUrl;
        return pkg;
      });
    });
};

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
