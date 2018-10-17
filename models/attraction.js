// ===== DB ====================================================================
import Knex  from '../db/knex';

const Attraction = () => Knex('attraction');

// ===== Attraction ======================================================
const getAllAttraction = () =>
  Attraction()
    .join('city', {'attraction.city_id': 'city.id'})
    .select('attraction.id', 'attraction.name', 'attraction.city_id as cityId','city.name as cityName',
      'attraction.desc', 'attraction.alias', 'attraction.tag', 'attraction.image_url as imageUrl')

const getAttractionByCityName = (cityName) =>
  Attraction()
    .join('city', {'attraction.city_id': 'city.id'})
    .select('attraction.id', 'attraction.name', 'attraction.city_id as cityId','city.name as cityName',
      'attraction.desc', 'attraction.alias', 'attraction.tag', 'attraction.image_url as imageUrl')
    .where('city.name', cityName);

const getAttractionByCityId = (cityId) =>
  Attraction()
    .join('city', {'attraction.city_id': 'city.id'})
    .select('attraction.id', 'attraction.name', 'attraction.city_id as cityId','city.name as cityName',
      'attraction.desc', 'attraction.alias', 'attraction.tag', 'attraction.image_url as imageUrl')
    .where('attraction.city_id', cityId);

const getAttraction = (attractionId) =>
  Attraction()
    .join('city', {'attraction.city_id': 'city.id'})
    .select('attraction.id', 'attraction.name', 'attraction.city_id as cityId','city.name as cityName',
      'attraction.desc', 'attraction.alias', 'attraction.tag', 'attraction.image_url as imageUrl')
    .where('attraction.id', attractionId)
    .first();

const setAttraction = (attraction) =>
  Attraction()
    .where({id: attraction.id})
    .update(
      {
        name: attraction.name,
        city_id: attraction.cityId,
        desc: attraction.desc,
        tag: attraction.tag,
        alias: attraction.alias,
        image_url: attraction.imageUrl
      },
      ['id', 'name', 'city_id as cityId', 'desc', 'alias', 'tag', 'imageUrl']
    );

const addAttraction = (attraction) =>
  Attraction()
    .insert(
      {
        name: attraction.name,
        city_id: attraction.cityId,
        desc: attraction.desc,
        tag: attraction.tag,
        alias: attraction.alias,
        image_url: attraction.imageUrl
      },
      ['id', 'name', 'city_id as cityId', 'desc', 'alias', 'tag', 'imageUrl']
    );

const delAttraction = (attractionId) =>
  Attraction()
    .where('id', attractionId)
    .del();

const getAttractionImageUrl = (attractionId) =>
  Attraction()
    .select('image_url')
    .where('id', attractionId)
    .first();


const setAttractionImageUrl = (attraction) =>
  Attraction()
    .where({id: attraction.id})
    .update(
      {
        image_url: attraction.imageUrl
      },
      ['id']
    );

export default {
  getAllAttraction,
  getAttractionByCityName,
  getAttractionByCityId,
  getAttraction,
  setAttraction,
  addAttraction,
  delAttraction,
  getAttractionImageUrl,
  setAttractionImageUrl,
};
