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

export default {
  getAllImages,
  getImageByPackageId,
};
