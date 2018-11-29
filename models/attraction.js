// ===== DB ====================================================================
import Knex  from '../db/knex';

const Attraction = () => Knex('attraction');
const AttractionImage = () => Knex('attraction_image');

// ===== Attraction ======================================================
const getAllAttraction = () =>
  Attraction()
    .join('city', {'city.id': 'attraction.city_id'})
    .join('attraction_image', {'attraction_image.attraction_id': 'attraction.id',
      'attraction_image.is_cover_page': Knex.raw('?', [true])})
    .select('attraction.id', 'attraction.name', 'attraction.description',
      'attraction.tag', 'attraction.alias', 'attraction.visit_hours as visitHours',
      'attraction.traffic_hours as trafficHours', 'attraction.city_id as cityId',
      'city.name as cityName', 'attraction_image.image_url as imageUrl',
      'attraction.nearby_attractions as nearbyAttractions');

const getAttractionByCityName = (cityName) =>
  Attraction()
    .join('city', {'city.id': 'attraction.city_id'})
    .join('attraction_image', {'attraction_image.attraction_id': 'attraction.id',
      'attraction_image.is_cover_page': Knex.raw('?', [true])})
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
    'attraction_image.is_cover_page': Knex.raw('?', [true])})
  .select('attraction.id', 'attraction.name', 'attraction.description',
    'attraction.tag', 'attraction.alias', 'attraction.visit_hours as visitHours',
    'attraction.traffic_hours as trafficHours', 'attraction.city_id as cityId',
    'city.name as cityName', 'attraction_image.image_url as imageUrl',
    'attraction.nearby_attractions as nearbyAttractions')
    .where('attraction.city_id', cityId);

const getAttraction = (id) =>
  Attraction()
    .join('city', {'city.id': 'attraction.city_id'})
    .join('attraction_image', {'attraction_image.attraction_id': 'attraction.id',
      'attraction_image.is_cover_page': Knex.raw('?', [true])})
    .select('attraction.id', 'attraction.name', 'attraction.description',
      'attraction.tag', 'attraction.alias', 'attraction.visit_hours as visitHours',
      'attraction.traffic_hours as trafficHours', 'attraction.city_id as cityId',
      'city.name as cityName', 'attraction_image.image_url as imageUrl',
      'attraction.nearby_attractions as nearbyAttractions')
    .where('attraction.id', id)
    .first();

const updateAttraction = (item) =>
  Attraction()
  .where({id: item.id})
  .update(
    {
      name: item.name,
      description: item.description,
      tag: item.tag,
      alias: item.alias,
      visit_hours: item.visitHours,
      traffic_hours: item.trafficHours,
      nearby_attractions: item.nearbyAttractions,
      notes: item.notes,
      additional_field: item.additionalField,
      city_id: item.cityId,
    },
    ['id', 'name', 'description', 'visit_hours as visitHours', 'notes', 'tag',
      'additional_field as additionalField', 'traffic_hours as trafficHours',
      'nearby_attractions as nearbyAttractions', 'alias', 'city_id as cityId']
  )
  .then(([result]) => {return result;});

const updateAttractionImage = (item) =>
  AttractionImage()
  .where({attraction_id: item.id})
  .update({image_url: item.imageUrl}, ['image_url as imageUrl'])
  .then(([result]) => {return result;});

const setAttraction = (item) => {
  return Promise.all([
    updateAttraction(item),
    updateAttractionImage(item),
  ])
  .then(([attraction, image]) => {
    attraction.imageUrl = image.imageUrl;
    return attraction;
  });
};

const insertAttraction = (item) => {
  return Promise.all([
    item,
    Attraction()
    .insert(
      {
        name: item.name,
        description: item.description,
        tag: item.tag,
        alias: item.alias,
        visit_hours: item.visitHours,
        traffic_hours: item.trafficHours,
        nearby_attractions: item.nearbyAttractions,
        notes: item.notes,
        additional_field: item.additionalField,
        city_id: item.cityId,
      },
      ['id', 'name', 'description', 'visit_hours as visitHours', 'notes', 'tag',
        'additional_field as additionalField', 'traffic_hours as trafficHours',
        'nearby_attractions as nearbyAttractions', 'alias', 'city_id as cityId']
    )
    .then(([result]) => {return result;}),
  ])
  .then(([item, attraction]) => {
    attraction.imageUrl = item.imageUrl;
    return attraction;
  });
};

const insertAttractionImage = (item) =>
  AttractionImage()
  .insert(
    {
      attraction_id: item.id,
      image_url: item.imageUrl,
      is_cover_page: true,
    },
    ['image_url as imageUrl'])
  .then(([result]) => {return result;});

const addAttraction = (item) => {
  return insertAttraction(item)
    .then((attraction) => {
      return Promise.all([
        attraction,
        insertAttractionImage(attraction),
      ])
      .then(([attraction, image]) => {
        attraction.imageUrl = image.imageUrl;
        return attraction;
      });
    });
};

const delAttraction = (attractionId) =>
  AttractionImage()
    .where('attraction_id', attractionId)
    .del()
    .then(() =>
      Attraction()
        .where('id', attractionId)
        .del()
    );

export default {
  getAllAttraction,
  getAttractionByCityName,
  getAttractionByCityId,
  getAttraction,
  setAttraction,
  addAttraction,
  delAttraction,
};
