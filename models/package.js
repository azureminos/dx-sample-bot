// ===== DB ====================================================================
import Knex  from '../db/knex';

const Package = () => Knex('package');
const PackageItem = () => Knex('package_item');
const RatePlan = () => Knex('rate_plan');

// ===== Package ======================================================
const getAllPackage = () =>
  Package()
    .where('is_active', true)
    .select('id', 'name', 'desc', 'days', 'is_promoted')

const getAllPromotedPackage = () =>
  Package()
    .where('is_active', true)
    .where('is_promoted', true)
    .select('id', 'name', 'desc', 'days', 'is_promoted')

const getPackageByCountry = (countryName) =>
  Package()
    .join('package_item', {'package_item.pkg_id': 'package.id'})
    .join('attraction', {'attraction.id': 'package_item.attraction_id'})
    .join('city', {'city.id': 'attraction.city_id'})
    .join('country', {'country.id': 'city.ccountry_id'})
    .select('package.id', 'package.name', 'package.desc', 'package.days', 'package.is_promoted')
    .where('country.name', countryName)
    .where('is_active', true)

const getPackageByCity = (cityName) =>
  Package()
    .join('package_item', {'package_item.pkg_id': 'package.id'})
    .join('attraction', {'attraction.id': 'package_item.attraction_id'})
    .join('city', {'city.id': 'attraction.city_id'})
    .select('package.id', 'package.name', 'package.desc', 'package.days', 'package.is_promoted')
    .where('city.name', cityName)
    .where('is_active', true)

const getPackage = (packageId) =>
  Package()
    .where('attraction.id', packageId)
    .where('is_active', true)
    .select('id', 'name', 'desc', 'days', 'is_promoted')
    .first()

const setPackage = (package) =>
  Package()
    .where({id: package.id})
    .update(
      {
        name: package.name,
        desc: package.desc,
        days: package.days,
        is_promoted: package.isPromoted,
        is_active: package.isActive,
      },
      ['id', 'name', 'desc', 'days', 'is_promoted']
    )

const addPackage = (package) =>
  Package()
    .insert(
      {
        name: package.name,
        desc: package.desc,
        days: package.days,
        is_promoted: package.isPromoted,
        is_active: package.isActive,
      },
      ['id', 'name', 'desc', 'days', 'is_promoted']
    )

const delPackage = (packageId) =>
  Package()
    .where({id: packageId})
    .update(
      {
        is_active: false,
      },
      ['id', 'name', 'desc', 'days', 'is_promoted']
    )

const getPackageImageUrl = (packageId) =>
  Package()
    .select('imageUrl')
    .where('id', attractionId)
    .first()

const setPackageImageUrl = (package) =>
  Package()
    .where({id: package.id})
    .update(
      {
        imageUrl: package.imageUrl
      },
      ['id']
    )

const getAllPackageDetails = () =>
  Package()
    .select('image_url')
    .where('id', attractionId)
    .first()

const getPackageDetails = (packageId) => {
  return Package()
    .select('image_url')
    .where('id', attractionId)
    .first()
}


export default {
  getAllPackage,
  getPackageByCityName,
  getPackageByCityId,
  getPackage,
  setPackage,
  addPackage,
  delPackage,
  getPackageImage,
  setPackageImage,
};
