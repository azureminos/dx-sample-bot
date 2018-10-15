// ===== DB ====================================================================
import Knex  from '../db/knex';

const Country = () => Knex('country');
//const City = () => Knex('city');
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
    .join('country', {'city.countryId': 'country.id'})
    .select('id', 'name', 'countryId','country.name as countryName', 'desc', 'alias', 'tag');

const getCityByCountryName = (countryName) =>
  City()
    .join('country', {'city.countryId': 'country.id'})
    .select('id', 'name', 'countryId','country.name as countryName', 'desc', 'alias', 'tag')
    .where('country.name', countryName);

const getCityByCountryId = (countryId) =>
  City()
    .join('country', {'city.countryId': 'country.id'})
    .select('id', 'name', 'countryId','country.name as countryName', 'desc', 'alias', 'tag')
    .where('countryId', countryId);

const getCity = (cityId) =>
  City()
    .join('country', {'city.countryId': 'country.id'})
    .select('id', 'name', 'countryId','country.name as countryName', 'desc', 'alias', 'tag')
    .where('id', cityId)
    .first();

const setCity = (city) =>
  City()
    .where({id: city.id})
    .update(
      {
        name: city.name,
        countryId: city.countryId,
        desc: city.desc,
        tag: city.tag,
        alias: city.alias,
      },
      ['id', 'name', 'countryId', 'desc', 'alias', 'tag']
    );

const addCity = (city) =>
  City()
    .insert(city, ['id', 'name', 'countryId', 'desc', 'alias', 'tag']);

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
