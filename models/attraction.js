// ===== DB ====================================================================
import Knex  from '../db/knex';

const Attraction = () => Knex('attraction');

// ===== Attraction ======================================================
const getAllAttraction = () =>
  Attraction()
    .join('city', {'attraction.city_id': 'city.id'})
    .select('attraction.id', 'attraction.name', 'attraction.city_id as cityId','city.name as cityName',
      'attraction.description', 'attraction.alias', 'attraction.tag')

const getAttractionByCityName = (cityName) =>
  Attraction()
    .join('city', {'attraction.city_id': 'city.id'})
    .select('attraction.id', 'attraction.name', 'attraction.city_id as cityId','city.name as cityName',
      'attraction.description', 'attraction.alias', 'attraction.tag')
    .where('city.name', cityName);

const getAttractionByCityId = (cityId) =>
  Attraction()
    .join('city', {'attraction.city_id': 'city.id'})
    .select('attraction.id', 'attraction.name', 'attraction.city_id as cityId','city.name as cityName',
      'attraction.description', 'attraction.alias', 'attraction.tag')
    .where('attraction.city_id', cityId);

const getAttraction = (attractionId) =>
  Attraction()
    .join('city', {'attraction.city_id': 'city.id'})
    .select('attraction.id', 'attraction.name', 'attraction.city_id as cityId','city.name as cityName',
      'attraction.description', 'attraction.alias', 'attraction.tag')
    .where('attraction.id', attractionId)
    .first();

const setAttraction = (attraction) =>
  Attraction()
    .where({id: attraction.id})
    .update(
      {
        name: attraction.name,
        city_id: attraction.cityId,
        description: attraction.description,
        tag: attraction.tag,
        alias: attraction.alias,
      },
      ['id', 'name', 'city_id as cityId', 'description', 'alias', 'tag']
    );

const addAttraction = (attraction) =>
  Attraction()
    .insert(
      {
        name: attraction.name,
        city_id: attraction.cityId,
        description: attraction.description,
        tag: attraction.tag,
        alias: attraction.alias,
      },
      ['id', 'name', 'city_id as cityId', 'description', 'alias', 'tag']
    );

const delAttraction = (attractionId) =>
  Attraction()
    .where('id', attractionId)
    .del();

export default {
  getAllAttraction,
  getAttractionByCityName,
  getAttractionByCityId,
  getAttraction,
  setAttraction,
  addAttraction,
  delAttraction,
};
