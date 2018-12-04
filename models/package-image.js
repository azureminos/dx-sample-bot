// ===== DB ====================================================================
import Knex  from '../db/knex';

const PackageImage = () => Knex('package_image');

// ===== Package ======================================================
const getAllImages = () =>
  PackageImage()
    .select('id', 'pkg_id as packageId', 'image_url as imageUrl',
      'is_cover_page as isCoverPage');

const getImageByPackageId = (packageId) =>
  PackageImage()
    .where('pkg_id', packageId)
    .select('id', 'pkg_id as packageId', 'image_url as imageUrl',
      'is_cover_page as isCoverPage');

const updatePackageImage = (pkg) =>
  PackageImage()
  .where({pkg_id: pkg.id})
  .update({image_url: pkg.imageUrl}, ['image_url as imageUrl'])
  .then(([result]) => {return result;});

const insertPackageImage = (item) =>
  PackageImage()
  .insert(
    {
      pkg_id: item.id,
      image_url: item.imageUrl,
      is_cover_page: true,
    },
    ['image_url as imageUrl'])
  .then(([result]) => {return result;});

export default {
  getAllImages,
  getImageByPackageId,
  updatePackageImage,
  insertPackageImage,
};
