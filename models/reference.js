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
      ['id', 'name', 'region', 'desc', 'alias', 'tag']
    );

const addCountry = (country) =>
  Country()
    .insert(country, ['id', 'name', 'region', 'desc', 'alias', 'tag']);

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
