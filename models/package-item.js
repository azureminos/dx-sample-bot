// ===== DB ====================================================================
import Knex  from '../db/knex';

const PackageItem = () => Knex('package_item');

// ===== Region & Country ======================================================
const getAllPackageItem = () =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .select('package_item.id', 'package_item.pkg_id as packageId', 'package_item.day_no as dayNo', 'package_item.day_seq as daySeq',
      'package_item.attraction_id as attractionId', 'attraction.name', 'package_item.description', 'package_item.notes');

const getItemByPackageId = (packageId) =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .join('attraction_image', {'attraction_image.attraction_id': 'package_item.attraction_id', 'attraction_image.is_cover_page': Knex.raw('?', [true])})
    .join('city', 'city.id', 'attraction.city_id')
    .select('package_item.id', 'package_item.pkg_id as packageId', 'package_item.day_no as dayNo', 'package_item.day_seq as daySeq',
      'package_item.attraction_id as attractionId', 'attraction.name', 'package_item.description', 'package_item.notes', 
      'city.name as city', 'attraction_image.image_url as imageUrl')
    .where('package_item.pkg_id', packageId);

const getItemByPackageName = (packageName) =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .join('package', 'package.id', 'package_item.pkg_id')
    .join('attraction_image', {'attraction_image.attraction_id': 'package_item.attraction_id', 'attraction_image.is_cover_page': Knex.raw('?', [true])})
    .join('city', 'city.id', 'attraction.city_id')
    .select('package_item.id', 'package_item.pkg_id as packageId', 'package_item.day_no as dayNo', 'package_item.day_seq as daySeq',
      'package_item.attraction_id as attractionId', 'attraction.name', 'package_item.description', 'package_item.notes', 
      'city.name as city', 'attraction_image.image_url as imageUrl')
    .where('package.name', packageName);

const getPackageItem = (itemId) =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .select('package_item.id', 'package_item.pkg_id as packageId', 'package_item.day_no as dayNo', 'package_item.day_seq as daySeq',
      'package_item.attraction_id as attractionId', 'attraction.name', 'package_item.description', 'package_item.notes')
    .where('id', itemId)
    .fist();

const setPackageItem = (item) =>
  PackageItem()
    .where({id: item.id})
    .update(
      {
        pkg_id: item.packageId,
        day_no: item.dayNo,
        day_seq: item.daySeq,
        attraction_id: item.attractionId,
        description: item.description,
        notes: item.notes,
      },
      ['id', 'pkg_id as packageId', 'day_no as dayNo', 'day_seq as daySeq',
        'attraction_id as attractionId', 'description', 'notes']
    );

const addPackageItem = (item) =>
  PackageItem()
    .insert(
      {
        pkg_id: item.packageId,
        day_no: item.dayNo,
        order: item.order,
        attraction_id: item.attractionId,
        desc: item.desc,
      },
      ['id', 'pkg_id as packageId', 'day_no as dayNo', 'day_seq as daySeq',
        'attraction_id as attractionId', 'description', 'notes']
    );

const delPackageItem = (itemId) =>
  PackageItem()
    .where('id', itemId)
    .del();

export default {
  getAllPackageItem,
  getItemByPackageId,
  getItemByPackageName,
  getPackageItem,
  setPackageItem,
  addPackageItem,
  delPackageItem,
};
