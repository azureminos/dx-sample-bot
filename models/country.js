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
    .select('id', 'name', 'region', 'description', 'alias', 'tag',
      'additional_field as additionalField');

const getCountryByRegion = (region) =>
  Country()
    .select('id', 'name', 'region', 'description', 'alias', 'tag',
      'additional_field as additionalField')
    .where('region', region)
    .orWhere('alias', 'like', '%'+region+'%')
    .orWhere('tag', 'like', '%'+region+'%');

const getCountry = (countryId) =>
  Country()
    .select('id', 'name', 'region', 'description', 'alias', 'tag',
      'additional_field as additionalField')
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
        additional_field: country.additionalField,
      },
      ['id', 'name', 'region', 'description', 'alias', 'tag', 'additional_field as additionalField']);
    /*.then((items) => {
      return items.map((item) => {
        return {
          id: item.id,
          name: item.name,
          region: item.region,
          description: item.description,
          alias: item.alias,
          tag: item.tag,
          additionalField: item.additional_field,
        };
      });
    });*/

const addCountry = (country) =>
  Country()
    .insert(
      {
        name: country.name,
        region: country.region,
        description: country.description,
        tag: country.tag,
        alias: country.alias,
        additional_field: country.additionalField,
      }, ['id', 'name', 'region', 'description', 'alias', 'tag',
        'additional_field as additionalField']);
    /*.then((items) => {
      console.log('>>>>Newly inserted country before re-format', items);
      const nItems = items.map((item) => {
        return {
          id: item.id,
          name: item.name,
          region: item.region,
          description: item.description,
          alias: item.alias,
          tag: item.tag,
          additionalField: item.additional_field,
        };
      });
      console.log('>>>>Newly inserted country after re-format', nItems);
      return nItems;
    });*/

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
