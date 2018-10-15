// ===== DB ====================================================================
import Knex  from '../db/knex';

const Country = () => Knex('country');
const City = () => Knex('city');
//const Attraction = () => Knex('attraction');

// ===== Region & Country ======================================================
const getAllRegion = () =>
  Country()
    .distinct('region')
    .select();

const getAllCountry = () =>
  Country()
    .select('id', 'name', 'region', 'desc', 'alias', 'tag');

const getCountryByRegion = (region) =>
  Country()
    .select('id', 'name', 'region', 'desc', 'alias', 'tag')
    .where('region', region)
    .orWhere('alias', 'like', '%'+region+'%')
    .orWhere('tag', 'like', '%'+region+'%');

const getCountry = (countryId) =>
  Country()
    .select('id', 'name', 'region', 'desc', 'alias', 'tag')
    .where('id', countryId)
    .fist();

const setCountry = (country) =>
  Country()
    .where({id: country.id})
    .update(
      {
        name: country.name,
        region: country.region,
        desc: country.desc,
        tag: country.tag,
        alias: country.alias,
      },
      ['id', 'name', 'region', 'desc', 'alias', 'tag']
    );

const addCountry = (country) =>
  Country()
    .insert(country, ['id', 'name', 'region', 'desc', 'alias', 'tag']);

const delCountry = (countryId) =>
  Country()
    .where('id', countryId)
    .del();

const getAllCity = () =>
  City()
    .join('country', {'city.country_id': 'country.id'})
    .select('city.id', 'city.name', 'city.country_id as countryId','country.name as countryName', 'city.desc', 'city.alias', 'city.tag')

const getCityByCountryName = (countryName) =>
  City()
    .join('country', {'city.country_id': 'country.id'})
    .select('city.id', 'city.name', 'city.country_id as countryId','country.name as countryName', 'city.desc', 'city.alias', 'city.tag')
    .where('country.name', countryName);

const getCityByCountryId = (countryId) =>
  City()
    .join('country', {'city.country_id': 'country.id'})
    .select('city.id', 'city.name', 'city.country_id as countryId','country.name as countryName', 'city.desc', 'city.alias', 'city.tag')
    .where('city.country_id', countryId);

const getCity = (cityId) =>
  City()
    .join('country', {'city.country_id': 'country.id'})
    .select('city.id', 'city.name', 'city.country_id as countryId','country.name as countryName', 'city.desc', 'city.alias', 'city.tag')
    .where('city.id', cityId)
    .first();

const setCity = (city) =>
  City()
    .where({id: city.id})
    .update(
      {
        name: city.name,
        country_id: city.countryId,
        desc: city.desc,
        tag: city.tag,
        alias: city.alias,
      },
      ['id', 'name', 'country_id as countryId', 'desc', 'alias', 'tag']
    );

const addCity = (city) =>
  City()
    .insert(
      {
        name: city.name,
        country_id: city.countryId,
        desc: city.desc,
        tag: city.tag,
        alias: city.alias,
      },
    ['id', 'name', 'country_id as countryId', 'desc', 'alias', 'tag']);

const delCity = (cityId) =>
  City()
    .where('id', cityId)
    .del();

export default {
  getAllRegion,
  getAllCountry,
  getCountryByRegion,
  getCountry,
  setCountry,
  addCountry,
  delCountry,
  getAllCity,
  getCityByCountryName,
  getCityByCountryId,
  getCity,
  setCity,
  addCity,
  delCity,
};
