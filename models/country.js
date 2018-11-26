// ===== DB ====================================================================
import Knex  from '../db/knex';

const Country = () => Knex('country');

// ===== Region & Country ======================================================
const getAllRegion = () =>
  Country()
    .distinct('region')
    .select();

const getAllCountry = () =>
  Country()
    .select('id', 'name', 'region', 'description', 'alias', 'tag', 'additional_field');

const getCountryByRegion = (region) =>
  Country()
    .select('id', 'name', 'region', 'description', 'alias', 'tag', 'additional_field')
    .where('region', region)
    .orWhere('alias', 'like', '%'+region+'%')
    .orWhere('tag', 'like', '%'+region+'%');

const getCountry = (countryId) =>
  Country()
    .select('id', 'name', 'region', 'description', 'alias', 'tag', 'additional_field')
    .where('id', countryId)
    .fist();

const setCountry = (country) =>
  Country()
    .where({id: country.id})
    .update(
      {
        name: country.name,
        region: country.region,
        description: country.description,
        tag: country.tag,
        alias: country.alias,
      },
      ['id', 'name', 'region', 'description', 'alias', 'tag', 'additional_field']
    );

const addCountry = (country) =>
  Country()
    .insert(country, ['id', 'name', 'region', 'description', 'alias', 'tag', 'additional_field']);

const delCountry = (countryId) =>
  Country()
    .where('id', countryId)
    .del();

export default {
  getAllRegion,
  getAllCountry,
  getCountryByRegion,
  getCountry,
  setCountry,
  addCountry,
  delCountry,
};
