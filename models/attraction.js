// ===== DB ====================================================================
import Knex  from '../db/knex';

const Attraction = () => Knex('attraction');

// ===== Attraction ======================================================
const getAllAttraction = () =>
  Attraction()
    .join('city', {'attraction.city_id': 'city.id'})
    .select('attraction.id', 'attraction.name', 'attraction.city_id as cityId','city.name as cityName', 'attraction.desc', 'attraction.alias', 'attraction.tag')

const getAttractionByCityName = (cityName) =>
  Attraction()
    .join('city', {'attraction.city_id': 'city.id'})
    .select('attraction.id', 'attraction.name', 'attraction.city_id as cityId','city.name as cityName', 'attraction.desc', 'attraction.alias', 'attraction.tag')
    .where('city.name', cityName);

const getAttractionByCityId = (cityId) =>
  Attraction()
    .join('city', {'attraction.city_id': 'city.id'})
    .select('attraction.id', 'attraction.name', 'attraction.city_id as cityId','city.name as cityName', 'attraction.desc', 'attraction.alias', 'attraction.tag')
    .where('attraction.city_id', cityId);

const getAttraction = (attractionId) =>
  Attraction()
    .join('city', {'attraction.city_id': 'city.id'})
    .select('attraction.id', 'attraction.name', 'attraction.city_id as cityId','city.name as cityName', 'attraction.desc', 'attraction.alias', 'attraction.tag')
    .where('attraction.id', attractionId)
    .first();

const setAttraction = (attraction) =>
  Attraction()
    .where({id: attraction.id})
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

const addAttraction = (city) =>
  Attraction()
    .insert(
      {
        name: city.name,
        country_id: city.countryId,
        desc: city.desc,
        tag: city.tag,
        alias: city.alias,
      },
    ['id', 'name', 'country_id as countryId', 'desc', 'alias', 'tag']);

const delAttraction = (attractionId) =>
  Attraction()
    .where('id', attractionId)
    .del();

const getAttractionImage = (attractionId) =>
  Attraction()
    .select('id', 'name', 'image')
    .where('id', attractionId)
    .first();

export default {
  getAllAttraction,
  getAttractionByCityName,
  getAttractionByCityId,
  getAttraction,
  setAttraction,
  addAttraction,
  delAttraction,
  getAttractionImage,
};
