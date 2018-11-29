// ===== DB ====================================================================
import Knex  from '../db/knex';

const Hotel = () => Knex('hotel');

// ===== Hotel ======================================================
const getAllHotel = () =>
    Hotel()
    .join('city', {'city.id': 'hotel.city_id'})
    .select('hotel.id', 'hotel.name', 'hotel.description', 'hotel.stars',
      'hotel.type_name as typeName', 'hotel.type_value as typeValue',
      'hotel.room_type as roomType', 'hotel.cost', 'hotel.notes',
      'hotel.additional_field as additionalField', 'hotel.city_id as cityId',
      'city.name as cityName');

const getHotelByCityName = (cityName) =>
Hotel()
    .join('city', {'city.id': 'hotel.city_id'})
    .select('hotel.id', 'hotel.name', 'hotel.description', 'hotel.stars',
      'hotel.type_name as typeName', 'hotel.type_value as typeValue',
      'hotel.room_type as roomType', 'hotel.cost', 'hotel.notes',
      'hotel.additional_field as additionalField', 'hotel.city_id as cityId',
      'city.name as cityName')
    .where('city.name', cityName);

const getHotelByCityId = (cityId) =>
Hotel()
  .join('city', {'city.id': 'hotel.city_id'})
  .select('hotel.id', 'hotel.name', 'hotel.description', 'hotel.stars',
    'hotel.type_name as typeName', 'hotel.type_value as typeValue',
    'hotel.room_type as roomType', 'hotel.cost', 'hotel.notes',
    'hotel.additional_field as additionalField', 'hotel.city_id as cityId',
    'city.name as cityName')
  .where('city.id', cityId);

const getHotel = (id) =>
  Hotel()
    .join('city', {'city.id': 'hotel.city_id'})
    .select('hotel.id', 'hotel.name', 'hotel.description', 'hotel.stars',
      'hotel.type_name as typeName', 'hotel.type_value as typeValue',
      'hotel.room_type as roomType', 'hotel.cost', 'hotel.notes',
      'hotel.additional_field as additionalField', 'hotel.city_id as cityId',
      'city.name as cityName')
    .where('hotel.id', id)
    .first();

const setHotel = (hotel) =>
  Hotel()
    .where({id: hotel.id})
    .update(
      {
        name: hotel.name,
        description: hotel.description,
        stars: hotel.stars,
        type_name: hotel.typeName,
        type_value: hotel.typeValue,
        room_type: hotel.roomType,
        cost: hotel.cost,
        notes: hotel.notes,
        additional_field: hotel.additionalField,
        city_id: hotel.cityId,
      },
      ['id', 'id', 'name', 'description', 'stars', 'type_name as typeName',
        'type_value as typeValue', 'room_type as roomType', 'cost', 'notes',
        'additional_field as additionalField', 'city_id as cityId']
    )
    .then(([item]) => {
      return item;
    });

const addHotel = (hotel) =>
  Hotel()
    .insert(
      {
        name: hotel.name,
        description: hotel.description,
        stars: hotel.stars,
        type_name: hotel.typeName,
        type_value: hotel.typeValue,
        room_type: hotel.roomType,
        cost: hotel.cost,
        notes: hotel.notes,
        additional_field: hotel.additionalField,
        city_id: hotel.cityId,
      },
      ['id', 'id', 'name', 'description', 'stars', 'type_name as typeName',
        'type_value as typeValue', 'room_type as roomType', 'cost', 'notes',
        'additional_field as additionalField', 'city_id as cityId']
    )
    .then(([item]) => {
      return item;
    });

const delHotel = (id) =>
  Hotel()
    .where('id', id)
    .del();

export default {
  getAllHotel,
  getHotelByCityName,
  getHotelByCityId,
  getHotel,
  setHotel,
  addHotel,
  delHotel,
};
