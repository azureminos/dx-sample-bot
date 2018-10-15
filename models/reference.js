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
    .select('id as countryId', 'name as countryName', 'desc as countryDesc', 'alias', 'tag');

const getCountryByRegion = (region) =>
  Country()
    .select('id as countryId', 'name as countryName', 'desc as countryDesc', 'alias', 'tag')
    .where('region', region)
    .orWhere('alias', 'like', '%'+region+'%')
    .orWhere('tag', 'like', '%'+region+'%');

const getCountry = (countryId) =>
  Country()
    .select('id as countryId', 'name as countryName', 'desc as countryDesc', 'alias', 'tag')
    .where('id', countryId);

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
      ['id', 'name', 'region', 'desc', 'tag', 'alias']
    );

const addCountry = (country) =>
  Country()
    .insert(country, ['id', 'name', 'region', 'desc', 'tag', 'alias']);

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
