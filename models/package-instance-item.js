// ===== DB ====================================================================
import Knex  from '../db/knex';
import knex from '../db/knex';

const PackageInstItem = () => Knex('package_inst_item');
// ===== Package ======================================================
const getPackageInstItem = (instId) =>
  PackageInstItem()
    .join('attraction', 'attraction.id', 'package_inst_item.attraction_id')
    .join('attraction_image', {'attraction_image.attraction_id': 'package_inst_item.attraction_id', 'attraction_image.is_cover_page': knex.raw('?', [true])})
    .join('city', 'city.id', 'attraction.city_id')
    .select('package_inst_item.id', 'package_inst_item.day_no as dayNo', 'package_inst_item.day_seq as daySeq',
      'package_inst_item.created_by as createdBy', 'package_inst_item.updated_by as updatedBy', 'city.name as city',
      'attraction.id as attractionId', 'attraction.name as attractionName', 'attraction.description as description',
      'attraction_image.image_url as attractionImageUrl')
    .where('package_inst_item.pkg_inst_id', instId);

const addPackageInstItem = (instId, pkgItems) => {
  //console.log('>>>>Add package instance items, instId['+instId+']', pkgItems);
  const items = pkgItems.map((item) => {
    return {
      pkg_inst_id: instId,
      attraction_id: item.attractionId,
      day_no: item.dayNo,
      day_seq: item.daySeq,
    };
  });
  //console.log('>>>>after re-format', items);
  return PackageInstItem().insert(items);
}

const delPackageInstItem = (instId) =>
  PackageInstItem()
    .where('pkg_inst_id', instId)
    .del();

export default {
  getPackageInstItem,
  addPackageInstItem,
  delPackageInstItem,
};
