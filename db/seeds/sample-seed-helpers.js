/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const COUNTRY = [
  {name: 'China', description: 'China', region: 'Asia Pacific'},
];

const CITY = [
  {name: 'Beijing', description: 'Beijing', country_id: 1},
  {name: 'Shanghai', description: 'Shanghai', country_id: 1},
];

const ATTRACTION = [
  {city_id: 1, name: 'The Forbidden Palace', description: 'Forbiden Palace',visit_hours: 2,
    traffic_hours: 1, nearby_attractions: 2, cost: 20, rate: 30},
  {city_id: 1, name: 'Tian An Men', description: 'Tian An Men', visit_hours: 2,
    traffic_hours: 1, nearby_attractions: 1, cost: 20, rate: 30},
  {city_id: 1, name: 'The Great Wall', description: 'The Great Wall', visit_hours: 2,
    traffic_hours: 2, nearby_attractions: 1, cost: 20, rate: 30},
  {city_id: 1, name: 'Olympic Park', description: 'Olympic Park', visit_hours: 1,
    traffic_hours: 1, nearby_attractions: 1, cost: 20, rate: 30},
  {city_id: 2, name: 'Longhua Temple', description: 'Longhua Temple', visit_hours: 2,
    traffic_hours: 1, cost: 20, rate: 30},
  {city_id: 2, name: 'Yu Garden', description: 'Yu Garden', visit_hours: 2,
    traffic_hours: 1, cost: 20, rate: 30},
  {city_id: 2, name: 'Disneyland', description: 'Disneyland', visit_hours: 2,
    traffic_hours: 1, cost: 20, rate: 30},
  {city_id: 2, name: 'Huai Hai Road', description: 'Huai Hai Road', visit_hours: 2,
    traffic_hours: 1, cost: 20, rate: 30},
  {city_id: 2, name: 'The Bund', description: 'The Bund', visit_hours: 2,
    traffic_hours: 1, cost: 20, rate: 30},
  {city_id: 2, name: 'Nan Jing Road', description: 'Nan Jing Road', visit_hours: 2,
    traffic_hours: 1, cost: 20, rate: 30},
];

const ATTRACTION_IMAGE = [
  {attraction_id: 1, image_url: 'media/Beijing_ForbiddenPalace.jpg', is_cover_page: true},
  {attraction_id: 2, image_url: 'media/Beijing_TianAnMen.jpg', is_cover_page: true},
  {attraction_id: 3, image_url: 'media/Beijing_GreatWall.jpg', is_cover_page: true},
  {attraction_id: 4, image_url: 'media/Beijing_OlympicPark.jpg', is_cover_page: true},
  {attraction_id: 5, image_url: 'media/Shanghai_LonghuaTemple.jpg', is_cover_page: true},
  {attraction_id: 6, image_url: 'media/Shanghai_YuGarden.jpg', is_cover_page: true},
  {attraction_id: 7, image_url: 'media/Shanghai_Disney.jpg', is_cover_page: true},
  {attraction_id: 8, image_url: 'media/Shanghai_HuaihaiRoad.jpg', is_cover_page: true},
  {attraction_id: 9, image_url: 'media/Shanghai_TheBund.jpg', is_cover_page: true},
  {attraction_id: 10, image_url: 'media/Shanghai_NanjingRoad.jpg', is_cover_page: true},
];

const PACKAGE = [{
  name: '4 Days China Tour',
  description: 'It\'s a 4 Days China Tour. First 2 days in Beijing, then 2 days in Shanghai.',
  fine_print: 'Depart every Tuesday and Friday from 01/06/2019 to 30/09/2019. extra 500 for single traveller',
  notes: 'No surcharge for families.',
  days: 4,
  max_participant: 30,
  is_promoted: true,
  is_active: true,
  is_extention: false,
},
{
  name: '3 Days China Tour',
  description: 'It\'s a 3 Days China Tour. First 2 days in Beijing, then 1 day in Shanghai.',
  fine_print: 'Depart every Tuesday and Friday from 01/06/2019 to 30/09/2019. extra 500 for single traveller',
  notes: 'No surcharge for families.',
  days: 3,
  max_participant: 20,
  is_promoted: true,
  is_active: true,
  is_extention: false,
}];

const PACKAGE_IMAGE = [
  {pkg_id: 1, image_url: 'media/Beijing_ForbiddenPalace.jpg', is_cover_page: true},
  {pkg_id: 1, image_url: 'media/Beijing_TianAnMen.jpg', is_cover_page: false},
  {pkg_id: 1, image_url: 'media/Shanghai_LonghuaTemple.jpg', is_cover_page: false},
  {pkg_id: 1, image_url: 'media/Shanghai_YuGarden.jpg', is_cover_page: false},
  {pkg_id: 2, image_url: 'media/Beijing_ForbiddenPalace.jpg', is_cover_page: false},
  {pkg_id: 2, image_url: 'media/Beijing_TianAnMen.jpg', is_cover_page: true},
  {pkg_id: 2, image_url: 'media/Shanghai_LonghuaTemple.jpg', is_cover_page: false},
];

const PACKAGE_ITEM = [
  {pkg_id: 1, day_no: 1, day_seq: 1, attraction_id: 1, description: 'Day tour at The Forbidden Palace'},
  {pkg_id: 1, day_no: 1, day_seq: 2, attraction_id: 2, description: 'Day tour at Tian An Men'},
  {pkg_id: 1, day_no: 2, day_seq: 1, attraction_id: 3, description: 'Day tour at The Great Wall'},
  {pkg_id: 1, day_no: 3, day_seq: 1, attraction_id: 5, description: 'Day tour at Shanghai Longhua Temple'},
  {pkg_id: 1, day_no: 3, day_seq: 2, attraction_id: 6, description: 'Day tour at the Yu Garden'},
  {pkg_id: 1, day_no: 4, day_seq: 1, attraction_id: 7, description: 'Day tour at Disneyland'},
  {pkg_id: 2, day_no: 1, day_seq: 1, attraction_id: 1, description: 'Day tour at The Forbidden Palace'},
  {pkg_id: 2, day_no: 2, day_seq: 1, attraction_id: 2, description: 'Day tour at Tian An Men'},
  {pkg_id: 2, day_no: 3, day_seq: 1, attraction_id: 5, description: 'Day tour at Shanghai Longhua Temple'},
  {pkg_id: 2, day_no: 3, day_seq: 2, attraction_id: 6, description: 'Day tour at the Yu Garden'},
];

const HOTEL = [
  {city_id: 1, name: 'Holiday Inn Beijing', description: 'International 4 stars', stars: 4,
    type: 'Regular', room_type: 'Twin Share', cost: 70, rate: 80},
  {city_id: 1, name: 'The Beijing Hotel', description: 'Domestic 5 stars', stars: 5,
    type: 'Regular', room_type: 'Twin Share', cost: 70, rate: 80},
  {city_id: 2, name: 'Peninsula Shanghai', description: 'International 5 stars', stars: 5,
    type: 'Luxury', room_type: 'Twin Share', cost: 70, rate: 80},
  {city_id: 2, name: 'The Shanghai Hotel', description: 'Domestic 4 stars', stars: 4,
    type: 'Regular', room_type: 'Twin Share', cost: 70, rate: 80},
];

const HOTEL_IMAGE = [
  {hotel_id: 1, image_url: 'media/Hotel_Beijing_BeijingHolidayInn.jpg', is_cover_page: true},
  {hotel_id: 2, image_url: 'media/Hotel_Beijing_BeijingHotel.jpg', is_cover_page: true},
  {hotel_id: 3, image_url: 'media/Hotel_Shanghai_ShanghaiHotel.jpg', is_cover_page: true},
  {hotel_id: 4, image_url: 'media/Hotel_Shanghai_ShanghaiHotel.jpg', is_cover_page: true},
];

const PACKAGE_RATE = [
  {pkg_id: 1, tier: 1, premium_fee: 300, max_participant: 10, min_participant: 1, rate: 1700, cost: 1200},
  {pkg_id: 1, tier: 2, premium_fee: 0, max_participant: 30, min_participant: 11, rate: 1300, cost: 1000},
  {pkg_id: 2, tier: 1, premium_fee: 400, max_participant: 10, min_participant: 1, rate: 1200, cost: 800},
  {pkg_id: 2, tier: 2, premium_fee: 0, max_participant: 30, min_participant: 11, rate: 1000, cost: 700},
];

const CAR_RATE = [
  {pkg_id: 1, min_participant: 1, max_participant: 15, type: 'Regular', description: 'Small Bus',
    hour_rate: 20, hour_cost: 15, min_day_rate: 50, min_day_cost: 35},
  {pkg_id: 1, min_participant: 16, max_participant: 30, type: 'Regular', description: 'Bus',
    hour_rate: 15, hour_cost: 12, min_day_rate: 50, min_day_cost: 35},
  {pkg_id: 1, min_participant: 1, max_participant: 15, type: 'Luxury', description: 'Luxury Small Bus',
    hour_rate: 40, hour_cost: 30, min_day_rate: 50, min_day_cost: 35},
  {pkg_id: 1, min_participant: 16, max_participant: 30, type: 'Luxury', description: 'Luxury Bus',
    hour_rate: 35, hour_cost: 26, min_day_rate: 50, min_day_cost: 35},
  {pkg_id: 2, min_participant: 1, max_participant: 15, type: 'Regular', description: 'Small Bus',
    hour_rate: 20, hour_cost: 14, min_day_rate: 50, min_day_cost: 35},
  {pkg_id: 2, min_participant: 16, max_participant: 30, type: 'Regular', description: 'Bus',
    hour_rate: 15, hour_cost: 10, min_day_rate: 50, min_day_cost: 35},
  {pkg_id: 2, min_participant: 1, max_participant: 15, type: 'Luxury', description: 'Small Small Bus',
    hour_rate: 30, hour_cost: 25, min_day_rate: 50, min_day_cost: 35},
  {pkg_id: 2, min_participant: 16, max_participant: 30, type: 'Luxury', description: 'Luxury Bus',
    hour_rate: 25, hour_cost: 18, min_day_rate: 50, min_day_cost: 35},
];

const FLIGHT_RATE = [
  {pkg_id: 1, airline: 'Qantas', type: 'Economic', description: 'Direct flight to Beijing',
    flight_dates: '20190607,20190610,20190613,20190616', is_peak: false, rate: 700, cost: 500},
  {pkg_id: 1, airline: 'Qantas', type: 'Economic', description: 'Direct flight to Beijing',
    flight_dates: '20190701,20190702,20190703', is_peak: true, rate: 1050, cost: 800},
  {pkg_id: 2, airline: 'AirAsia', type: 'Budget', description: 'One stopover at Kuala Lumpur',
    flight_dates: '20190607,20190610,20190613,20190616', is_peak: false, rate: 550, cost: 400},
  {pkg_id: 2, airline: 'AirAsia', type: 'Budget', description: 'One stopover at Kuala Lumpur',
    flight_dates: '20190701,20190702,20190703', is_peak: false, rate: 750, cost: 550},
];
module.exports = {COUNTRY, CITY, ATTRACTION, ATTRACTION_IMAGE,
  PACKAGE, PACKAGE_IMAGE, PACKAGE_ITEM, HOTEL, HOTEL_IMAGE,
  PACKAGE_RATE, CAR_RATE, FLIGHT_RATE};
