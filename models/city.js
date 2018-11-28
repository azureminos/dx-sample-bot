// ===== DB ====================================================================
import Knex  from '../db/knex';

const City = () => Knex('city');

// ===== City ======================================================
const getAllCity = () =>
  City()
    .join('country', {'city.country_id': 'country.id'})
    .select('city.id', 'city.name', 'city.description', 'city.alias',
      'city.tag', 'city.additional_field as additionalField',
      'city.country_id as countryId', 'country.name as countryName');

const getCityByCountryName = (countryName) =>
  City()
    .join('country', {'city.country_id': 'country.id'})
    .select('city.id', 'city.name', 'city.description', 'city.alias',
      'city.tag', 'city.additional_field as additionalField',
      'city.country_id as countryId', 'country.name as countryName')
    .where('country.name', countryName);

const getCityByCountryId = (countryId) =>
  City()
    .join('country', {'city.country_id': 'country.id'})
    .select('city.id', 'city.name', 'city.description', 'city.alias',
      'city.tag', 'city.additional_field as additionalField',
      'city.country_id as countryId', 'country.name as countryName')
    .where('city.country_id', countryId);

const getCity = (cityId) =>
  City()
    .join('country', {'city.country_id': 'country.id'})
    .select('city.id', 'city.name', 'city.description', 'city.alias',
      'city.tag', 'city.additional_field as additionalField',
      'city.country_id as countryId', 'country.name as countryName')
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
        additional_field: city.additionalField,
      },
      ['id', 'name', 'country_id as countryId', 'desc', 'alias', 'tag',
        'additional_field as additionalField']
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
        additional_field: city.additionalField,
      },
      ['id', 'name', 'country_id as countryId', 'desc', 'alias', 'tag',
        'additional_field as additionalField']
    );

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
