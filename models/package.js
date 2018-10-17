// ===== DB ====================================================================
import Knex  from '../db/knex';

const Package = () => Knex('package');
const PackageItem = () => Knex('package_item');
const RatePlan = () => Knex('rate_plan');

// ===== Package ======================================================
const getAllPackage = () =>
  Package()
    .where('is_active', true)
    .select('id', 'name', 'desc', 'days', 'is_promoted as isPromoted', 'is_active as isActive', 'image_url as imageUrl')

const getAllPromotedPackage = () =>
  Package()
    .where('is_active', true)
    .where('is_promoted', true)
    .select('id', 'name', 'desc', 'days', 'is_promoted as isPromoted', 'is_active as isActive', 'image_url as imageUrl')

const getPackageByCountry = (countryName) =>
  Package()
    .join('package_item', {'package_item.pkg_id': 'package.id'})
    .join('attraction', {'attraction.id': 'package_item.attraction_id'})
    .join('city', {'city.id': 'attraction.city_id'})
    .join('country', {'country.id': 'city.ccountry_id'})
    .select('package.id', 'package.name', 'package.desc', 'package.days', 'package.is_promoted as isPromoted'
            , 'package.is_active as isActive', 'package.image_url as imageUrl')
    .where('country.name', countryName)
    .where('is_active', true)

const getPackageByCity = (cityName) =>
  Package()
    .join('package_item', {'package_item.pkg_id': 'package.id'})
    .join('attraction', {'attraction.id': 'package_item.attraction_id'})
    .join('city', {'city.id': 'attraction.city_id'})
    .select('package.id', 'package.name', 'package.desc', 'package.days', 'package.is_promoted as isPromoted'
            , 'package.is_active as isActive', 'package.image_url as imageUrl')
    .where('city.name', cityName)
    .where('is_active', true)

const getPackage = (packageId) =>
  Package()
    .where('attraction.id', packageId)
    .where('is_active', true)
    .select('id', 'name', 'desc', 'days', 'is_promoted as isPromoted', 'is_active as isActive', 'image_url as imageUrl')
    .first()

const setPackage = (pkg) =>
  Package()
    .where({id: pkg.id})
    .update(
      {
        name: pkg.name,
        desc: pkg.desc,
        days: pkg.days,
        is_promoted: pkg.isPromoted,
        is_active: pkg.isActive,
        image_url: pkg.imageUrl,
      },
      ['id', 'name', 'desc', 'days', 'is_promoted as isPromoted', 'is_active as isActive', 'image_url as imageUrl']
    )

const addPackage = (pkg) =>
  Package()
    .insert(
      {
        name: pkg.name,
        desc: pkg.desc,
        days: pkg.days,
        is_promoted: pkg.isPromoted,
        is_active: pkg.isActive,
        image_url: pkg.imageUrl,
      },
      ['id', 'name', 'desc', 'days', 'is_promoted as isPromoted', 'is_active as isActive', 'image_url as imageUrl']
    )

const delPackage = (packageId) =>
  Package()
    .where({id: packageId})
    .update(
      {
        is_active: false,
      },
      ['id']
    )

const getPackageImageUrl = (packageId) =>
  Package()
    .select('image_url as imageUrl')
    .where('id', attractionId)
    .first()

const setPackageImageUrl = (pkg) =>
  Package()
    .where({id: pkg.id})
    .update(
      {
        image_url: pkg.imageUrl
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
  getPackageByCountry,
  getPackageByCity,
  getPackage,
  setPackage,
  addPackage,
  delPackage,
  getPackageImageUrl,
  setPackageImageUrl,
  getAllPackageDetails,
  getPackageDetails,
};
