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
  {city_id: 1, name: 'The Forbidden Palace', description: 'Forbiden Palace', visit_hours: 2, traffic_hours: 1, nearby_attractions: 2},
  {city_id: 1, name: 'Tian An Men', description: 'Tian An Men', visit_hours: 2, traffic_hours: 1, nearby_attractions: 1},
  {city_id: 2, name: 'Longhua Temple', description: 'Longhua Temple', visit_hours: 2, traffic_hours: 1},
  {city_id: 2, name: 'Yu Garden', dedescriptionsc: 'Yu Garden', visit_hours: 2, traffic_hours: 1},
];

const ATTRACTION_IMAGE = [
  {attraction_id: 1, image_url: 'media/Beijing_ForbiddenPalace.jpg', is_cover_page: true},
  {attraction_id: 2, image_url: 'media/Beijing_TianAnMen.jpg', is_cover_page: true},
  {attraction_id: 3, image_url: 'media/Shanghai_LonghuaTemple.jpg', is_cover_page: true},
  {attraction_id: 4, image_url: 'media/Shanghai_YuGarden.jpg', is_cover_page: true},
];

const PACKAGE = [{
  name: '4 Days China Tour',
  description: 'It\'s a 4 Days China Tour. First 2 days in Beijing, then 2 days in Shanghai.',
  finePrint: 'Depart every Tuesday and Friday from 01/06/2019 to 30/09/2019. extra 500 for single traveller',
  notes: 'No surcharge for families.',
  days: 4,
  maxParticipant: 30,
  isPromoted: true,
  isActive: true,
  isExtention: false,
},
{
  name: '3 Days China Tour',
  description: 'It\'s a 3 Days China Tour. First 2 days in Beijing, then 1 day in Shanghai.',
  finePrint: 'Depart every Tuesday and Friday from 01/06/2019 to 30/09/2019. extra 500 for single traveller',
  notes: 'No surcharge for families.',
  days: 3,
  maxParticipant: 20,
  isPromoted: true,
  isActive: true,
  isExtention: false,
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
  {tour: '1 Day Beijing Tour', day_no: 1, order: 1001, activity: 'The Forbiden Palace', desc: 'Visit the Forbiden Palace'},
  {tour: '1 Day Shanghai Tour', day_no: 1, order: 1001, activity: 'Oriental Pearl Tower', desc: 'Visit the Oriental Pearl Tower in the morning'},
  {tour: '1 Day Shanghai Tour', day_no: 1, order: 1002, activity: 'The Bund', desc: 'Visit the Bund in the afternoon and evening'},
  {tour: '2 Days China Tour', day_no: 1, order: 1001, activity: 'The Forbiden Palace', desc: 'Visit the Forbiden Palace'},
  {tour: '2 Days China Tour', day_no: 2, order: 2001, activity: 'Oriental Pearl Tower', desc: 'Visit the Oriental Pearl Tower in the morning'},
  {tour: '2 Days China Tour', day_no: 2, order: 2002, activity: 'The Bund', desc: 'Visit the Bund in the afternoon and evening'},
];

module.exports = {COUNTRY, CITY, ATTRACTION, ATTRACTION_IMAGE, PACKAGE, PACKAGE_IMAGE, PACKAGE_ITEM};
