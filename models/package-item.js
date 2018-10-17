// ===== DB ====================================================================
import Knex  from '../db/knex';
import {camelCaseKeys} from './util';

const PackageItem = () => Knex('package_item');

// ===== Region & Country ======================================================
const getAllPackageItem = () =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .select('package_item.id', 'package_item.pkg_id as packageId', 'package_item.day_no as dayNo', 'package_item.order',
      'package_item.attraction_id as attractionId', 'attraction.name as attractionName')

const getItemByPackageId = (packageId) =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .select('package_item.id', 'package_item.pkg_id as packageId', 'package_item.day_no as dayNo', 'package_item.order',
      'package_item.attraction_id as attractionId', 'attraction.name as attractionName')
    .where('package_item.pkg_id', packageId)

const getItemByPackageName = (packageName) =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .join('package', 'package.id', 'package_item.pkg_id')
    .select('package_item.id', 'package_item.pkg_id as packageId', 'package_item.day_no as dayNo', 'package_item.order',
      'package_item.attraction_id as attractionId', 'attraction.name as attractionName')
    .where('package.name', packageName)

const getPackageItem = (itemId) =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .select('package_item.id', 'package_item.pkg_id as packageId', 'package_item.day_no as dayNo', 'package_item.order',
      'package_item.attraction_id as attractionId', 'attraction.name as attractionName')
    .where('id', itemId)
    .fist()

const setPackageItem = (item) =>
  PackageItem()
    .where({id: item.id})
    .update(
      {
        pkg_id: item.packageId,
        day_no: item.dayNo,
        order: item.order,
        attraction_id: item.attractionId,
      },
      ['id', 'pkg_id as packageId', 'day_no as dayNo', 'order', 'attraction_id as attractionId']
    )

const addPackageItem = (item) =>
  PackageItem()
    .insert(
      {
       pkg_id: item.packageId,
        day_no: item.dayNo,
        order: item.order,
        attraction_id: item.attractionId,
      },
      ['id', 'pkg_id as packageId', 'day_no as dayNo', 'order', 'attraction_id as attractionId']
    )

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
