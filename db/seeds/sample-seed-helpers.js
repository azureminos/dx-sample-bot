/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Constants for placeholder List data for seed files.
const PROMOS = [
  {title: '8 Days Cultural China'},
  {title: '15 Days Classic China'},
];

const LISTS = [
  {title: 'Shopping List'},
  {title: 'To Do List'},
  {title: 'Party Planning List'},
];

// Constants for placeholder User data for seed files.
const USERS = [
  {fb_id: 1},
  {fb_id: 2},
  {fb_id: 3},
  {fb_id: 4},
];

/**
 * getUsersLists - Gets placeholder UsersLists data for seed files.
 * @param   {Array} listIds - Array of list IDs.
 * @returns {Array} usersLists - Array of placeholder usersLists data for seeds.
 */
const getUsersLists = (listIds = []) => [
  {list_id: listIds[0], user_fb_id: 1, owner: true},
  {list_id: listIds[0], user_fb_id: 2},
  {list_id: listIds[0], user_fb_id: 3},
  {list_id: listIds[1], user_fb_id: 1},
  {list_id: listIds[1], user_fb_id: 2, owner: true},
  {list_id: listIds[2], user_fb_id: 2, owner: true},
  {list_id: listIds[2], user_fb_id: 3},
];

/**
 * getListsItems - Gets placeholder ListsItems data for seed files.
 * @param   {Array} listIds - Array of list IDs.
 * @returns {Array} listsItems - Array of placeholder listsItems data for seeds.
 */
const getListsItems = (listIds = []) => [
  {name: 'Cheese', list_id: listIds[0], owner_fb_id: 1, completer_fb_id: 2},
  {name: 'Milk', list_id: listIds[0], owner_fb_id: 3, completer_fb_id: 3},
  {name: 'Bread', list_id: listIds[0], owner_fb_id: 1},
  {name: 'Pay Bills', list_id: listIds[1], owner_fb_id: 1, completer_fb_id: 2},
  {name: 'Call Parents', list_id: listIds[1], owner_fb_id: 2},
  {name: 'Balloons', list_id: listIds[2], owner_fb_id: 2},
  {name: 'Invites', list_id: listIds[2], owner_fb_id: 3},
];

/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
const each = require("lodash/forEach");

const CITIES = [
  {name: 'Beijing', desc: 'Beijing'},
  {name: 'Shanghai', desc: 'Shanghai'},
];

const ATTRACTIONS = [
  {name: 'The Forbiden Palace', desc: 'Forbiden Palace', },
  {name: 'The Bund', desc: 'The Bund'},
  {name: 'The Great Wall', desc: 'The Great Wall'},
  {name: 'Oriental Pearl Tower', desc: 'Oriental Pearl Tower'},
];

const getReferences = () => {
  var rs = []
  each(CITIES, function(city) {
    rs.push({
      category: 'city',
      value: city.name,
      name: city.name,
      desc: city.desc,
    });
  });

  each(ATTRACTIONS, function(attraction) {
    rs.push({
      category: 'attraction',
      value: attraction.name,
      name: attraction.name,
      desc: attraction.desc,
    });
  });

  return rs;
};

const TOURS = [
  {name: '1 Day Beijing Tour', desc: '1 Day Beijing Tour', days: 1},
  {name: '1 Day Shanghai Tour', desc: '1 Day Shanghai Tour', days: 1},
  {name: '2 Days China Tour', desc: '2 Days China Tour', days: 2},
];

const getTours = () => {
  var rs = []
  each(TOURS, function(tour) {
    rs.push({
      name: tour.name,
      desc: tour.desc,
      days: tour.days,
      is_promoted: true,
      is_active: true,
    });
  });

  return rs;
};

const TOUR_DETAILS = [
  {tour: '1 Day Beijing Tour', day_no: 1, order: 1001, activity: 'The Forbiden Palace', desc: 'Visit the Forbiden Palace'},
  {tour: '1 Day Shanghai Tour', day_no: 1, order: 1001, activity: 'Oriental Pearl Tower', desc: 'Visit the Oriental Pearl Tower in the morning'},
  {tour: '1 Day Shanghai Tour', day_no: 1, order: 1002, activity: 'The Bund', desc: 'Visit the Bund in the afternoon and evening'},
  {tour: '2 Days China Tour', day_no: 1, order: 1001, activity: 'The Forbiden Palace', desc: 'Visit the Forbiden Palace'},
  {tour: '2 Days China Tour', day_no: 2, order: 2001, activity: 'Oriental Pearl Tower', desc: 'Visit the Oriental Pearl Tower in the morning'},
  {tour: '2 Days China Tour', day_no: 2, order: 2002, activity: 'The Bund', desc: 'Visit the Bund in the afternoon and evening'},
];

const getTourDetails = (ref) => {
  var rs = []
  each(TOUR_DETAILS, function(item) {
    var r = {
      tour_id: ref.tour[item.tour],
      day_no: item.day_no,
      order: item.order,
      item_id: ref.attraction[item.activity],
      desc: item.desc
    };
    rs.push(r);
  });
  console.log('>>>>getTourDetails', rs);
  return rs;
};

module.exports = {getListsItems, getUsersLists, LISTS, USERS, PROMOS,
  getReferences, getTours, getTourDetails, CITIES, ATTRACTIONS, TOURS, TOUR_DETAILS};
