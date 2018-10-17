// ===== DB ====================================================================
import Knex  from '../db/knex';

const PackageItem = () => Knex('package_item');

// ===== Region & Country ======================================================
const getAllPackageItem = () =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .select('id', 'pkg_id', 'day_no', 'order', 'attraction_id', 'attraction.name as attraction_name')
    .then(camelCaseKeys);

const getItemByPackageId = (packageId) =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .select('id', 'pkg_id', 'day_no', 'order', 'attraction_id', 'attraction.name as attraction_name')
    .where('package_item.pkg_id', packageId)
    .then(camelCaseKeys);

const getItemByPackageName = (packageName) =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .join('package', 'package.id', 'package_item.pkg_id')
    .select('id', 'pkg_id', 'day_no', 'order', 'attraction_id', 'attraction.name as attraction_name')
    .where('package.name', packageName)
    .then(camelCaseKeys);

const getPackageItem = (itemId) =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .select('id', 'pkg_id', 'day_no', 'order', 'attraction_id', 'attraction.name as attraction_name')
    .where('id', itemId)
    .fist()
    .then(camelCaseKeys);

const setPackageItem = (item) =>
  PackageItem()
    .where({id: item.id})
    .update(
      {
        pkg_id: item.pkdId,
        day_no: item.dayNo,
        order: item.order,
        attraction_id: item.attractionId,
      },
      ['id', 'pkg_id', 'day_no', 'order', 'attraction_id']
    ).then(camelCaseKeys);

const addPackageItem = (item) =>
  PackageItem()
    .insert(item, ['id', 'pkg_id', 'day_no', 'order', 'attraction_id'])
    .then(camelCaseKeys);

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
