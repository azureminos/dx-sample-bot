// ===== DB ====================================================================
import Knex  from '../db/knex';

const Attraction = () => Knex('attraction');

// ===== Attraction ======================================================
const getAllAttraction = () =>
  Attraction()
    .join('city', {'city.id': 'attraction.city_id'})
    .join('attraction_image', {'attraction_image.attraction_id': 'attraction.id',
      'attraction_image.is_cover_page': knex.raw('?', [true])})
    .select('attraction.id', 'attraction.name', 'attraction.description',
      'attraction.tag', 'attraction.alias', 'attraction.visit_hours as visitHours',
      'attraction.traffic_hours as trafficHours', 'attraction.city_id as cityId',
      'city.name as cityName', 'attraction_image.image_url as imageUrl',
      'attraction.nearby_attractions as nearbyAttractions');

const getAttractionByCityName = (cityName) =>
  Attraction()
    .join('city', {'city.id': 'attraction.city_id'})
    .join('attraction_image', {'attraction_image.attraction_id': 'attraction.id',
      'attraction_image.is_cover_page': knex.raw('?', [true])})
    .select('attraction.id', 'attraction.name', 'attraction.description',
      'attraction.tag', 'attraction.alias', 'attraction.visit_hours as visitHours',
      'attraction.traffic_hours as trafficHours', 'attraction.city_id as cityId',
      'city.name as cityName', 'attraction_image.image_url as imageUrl',
      'attraction.nearby_attractions as nearbyAttractions')
    .where('city.name', cityName);

const getAttractionByCityId = (cityId) =>
  Attraction()
  .join('city', {'city.id': 'attraction.city_id'})
  .join('attraction_image', {'attraction_image.attraction_id': 'attraction.id',
    'attraction_image.is_cover_page': knex.raw('?', [true])})
  .select('attraction.id', 'attraction.name', 'attraction.description',
    'attraction.tag', 'attraction.alias', 'attraction.visit_hours as visitHours',
    'attraction.traffic_hours as trafficHours', 'attraction.city_id as cityId',
    'city.name as cityName', 'attraction_image.image_url as imageUrl',
    'attraction.nearby_attractions as nearbyAttractions')
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
