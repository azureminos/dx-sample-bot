// ===== DB ====================================================================
import Knex  from '../db/knex';
import {camelCaseKeys} from './util';
// Dummy Data
import dPackageItem from '../dummy/package-item';

const PackageItem = () => Knex('package_item');

// ===== Region & Country ======================================================
const getAllPackageItem = () =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .select('package_item.id', 'package_item.pkg_id as packageId', 'package_item.day_no as dayNo', 'package_item.day_seq as daySeq',
      'package_item.attraction_id as attractionId', 'attraction.name as attractionName', 'package_item.description as description');

const getItemByPackageId = (packageId) =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .select('package_item.id', 'package_item.pkg_id as packageId', 'package_item.day_no as dayNo', 'package_item.day_seq as daySeq',
      'package_item.attraction_id as attractionId', 'attraction.name as attractionName', 'package_item.description as description')
    .where('package_item.pkg_id', packageId);

const getItemByPackageName = (packageName) =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .join('package', 'package.id', 'package_item.pkg_id')
    .select('package_item.id', 'package_item.pkg_id as packageId', 'package_item.day_no as dayNo', 'package_item.day_seq as daySeq',
      'package_item.attraction_id as attractionId', 'attraction.name as attractionName', 'package_item.description as description')
    .where('package.name', packageName);

const getPackageItem = (itemId) =>
  PackageItem()
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .select('package_item.id', 'package_item.pkg_id as packageId', 'package_item.day_no as dayNo', 'package_item.order',
      'package_item.attraction_id as attractionId', 'attraction.name as attractionName', 'package_item.desc as desc')
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
        desc: item.desc,
      },
      ['id', 'pkg_id as packageId', 'day_no as dayNo', 'order', 'attraction_id as attractionId', 'desc']
    )

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
      ['id', 'pkg_id as packageId', 'day_no as dayNo', 'order', 'attraction_id as attractionId', 'desc']
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
