// ===== DB ====================================================================
import Knex  from '../db/knex';

const PackageInstItem = () => Knex('package_inst_items');
// ===== Package ======================================================
const getPackageInstItem = (instId) =>
  PackageInstItem()
    .join('package_item', 'package_item.id', 'package_inst_items.pkg_item_id')
    .join('attraction', 'attraction.id', 'package_item.attraction_id')
    .join('city', 'city.id', 'attraction.city_id')
    .select('package_inst_items.id', 'package_inst_items.day_no as dayNo', 'package_inst_items.order',
      'package_inst_items.created_by as createdBy', 'package_inst_items.updated_by as updatedBy',
      'package_item.desc as desc', 'attraction.name as attractionName', 'attraction.desc as attractionDesc',
      'attraction.image_url as imageUrl', 'city.name as city')
    .where('package_inst_items.pkg_inst_id', instId)

const addPackageInstItem = (instId, pkgItems) => {
  console.log('>>>>Add package instance items, instId['+instId+']', pkgItems);
  const items = pkgItems.map((item) => {
    return {
      pkg_inst_id: instId,
      attraction_id: item.attractionId,
      day_no: item.dayNo,
      day_seq: item.daySeq,
    };
  });
  console.log('>>>>after re-format', items);
  return PackageInstItem().insert(items);
}

const delPackageInstItem = (instId) =>
  PackageInstItem()
    .where('pkg_inst_id', instId)
    .del()

export default {
  getPackageInstItem,
  addPackageInstItem,
  delPackageInstItem,
};
