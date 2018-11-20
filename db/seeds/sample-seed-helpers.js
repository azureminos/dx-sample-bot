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
  {city_id: 2, name: 'Yu Garden', description: 'Yu Garden', visit_hours: 2, traffic_hours: 1},
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
  {pkg_id: 1, day_no: 2, day_seq: 1, attraction_id: 2, description: 'Day tour at Tian An Men'},
  {pkg_id: 1, day_no: 3, day_seq: 1, attraction_id: 3, description: 'Day tour at Shanghai Longhua Temple'},
  {pkg_id: 1, day_no: 4, day_seq: 1, attraction_id: 4, description: 'Day tour at the Yu Garden'},
  {pkg_id: 2, day_no: 1, day_seq: 1, attraction_id: 1, description: 'Day tour at The Forbidden Palace'},
  {pkg_id: 2, day_no: 2, day_seq: 1, attraction_id: 2, description: 'Day tour at Tian An Men'},
  {pkg_id: 2, day_no: 3, day_seq: 1, attraction_id: 3, description: 'Day tour at Shanghai Longhua Temple'},
  {pkg_id: 2, day_no: 3, day_seq: 2, attraction_id: 4, description: 'Day tour at the Yu Garden'},
];

module.exports = {COUNTRY, CITY, ATTRACTION, ATTRACTION_IMAGE, PACKAGE, PACKAGE_IMAGE, PACKAGE_ITEM};
