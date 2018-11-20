// ===== DB ====================================================================
import Knex  from '../db/knex';

const City = () => Knex('city');

// ===== City ======================================================
const getAllCity = () =>
  City()
    .join('country', {'city.country_id': 'country.id'})
    .select('city.id', 'city.name', 'city.country_id as countryId', 'country.name as countryName', 'city.description', 'city.alias', 'city.tag')

const getCityByCountryName = (countryName) =>
  City()
    .join('country', {'city.country_id': 'country.id'})
    .select('city.id', 'city.name', 'city.country_id as countryId','country.name as countryName', 'city.description', 'city.alias', 'city.tag')
    .where('country.name', countryName);

const getCityByCountryId = (countryId) =>
  City()
    .join('country', {'city.country_id': 'country.id'})
    .select('city.id', 'city.name', 'city.country_id as countryId','country.name as countryName', 'city.description', 'city.alias', 'city.tag')
    .where('city.country_id', countryId);

const getCity = (cityId) =>
  City()
    .join('country', {'city.country_id': 'country.id'})
    .select('city.id', 'city.name', 'city.country_id as countryId','country.name as countryName', 'city.description', 'city.alias', 'city.tag')
    .where('city.id', cityId)
    .first();

const setCity = (city) =>
  City()
    .where({id: city.id})
    .update(
      {
        name: city.name,
        country_id: city.countryId,
        description: city.description,
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
        description: city.description,
        tag: city.tag,
        alias: city.alias,
      },
    ['id', 'name', 'country_id as countryId', 'desc', 'alias', 'tag']);

const delCity = (cityId) =>
  City()
    .where('id', cityId)
    .del();

export default {
  getAllCity,
  getCityByCountryName,
  getCityByCountryId,
  getCity,
  setCity,
  addCity,
  delCity,
};
