const _ = require('lodash');
const CONSTANTS = require('./constants');

const {Global, Instance} = CONSTANTS.get();
const instStatus = Instance.status;

const findCityNameById = (id, cities) => {
  let name = '';
  _.each(cities, (c) => {
    if (c.id === id) name = c.name;
  });
  return name;
};

const findCityByName = (name, cities) => {
  let city = null;
  _.each(cities, (c) => {
    if (c.name === name) city = c;
  });
  return city;
};

const findAttractionById = (id, cities) => {
  let attraction = null;
  _.each(cities, (c) => {
    const matcher = _.find(c.attractions, function(a) {
      return a.id === id;
    });
    if (matcher) {
      attraction = matcher;
      attraction.city = c.name;
    }
  });
  if (attraction) {
    return attraction;
  }
  return;
};

const findHotelById = (id, cities) => {
  let hotel = null;
  _.each(cities, (c) => {
    const matcher = _.find(c.hotels, function(h) {
      return h.id === id;
    });
    if (matcher) {
      hotel = matcher;
      hotel.city = c.name;
    }
  });
  if (hotel) {
    return hotel;
  }
  return;
};

const findCityByAttraction = (id, cities) => {
  let name = '';
  _.each(cities, (c) => {
    if (
      _.find(c.attractions, function(a) {
        return a.id === id;
      })
    ) {
      name = c.name;
    }
  });
  if (name) {
    return name;
  }
  return;
};

const findCityByHotel = (id, cities) => {
  let name = '';
  _.each(cities, (c) => {
    if (
      _.find(c.hotels, function(h) {
        return h.id === id;
      })
    ) {
      name = c.name;
    }
  });
  if (name) {
    return name;
  }
  return;
};

const enhanceItem = (item, cities) => {
  if (item.attraction) {
    const match = this.findAttractionById(item.attraction, cities);
    item.attraction = match;
  }
  return item;
};

const enhanceHotel = (hotel, cities) => {
  if (hotel.hotel) {
    const match = this.findHotelById(hotel.hotel, cities);
    hotel.hotel = match;
  }
  return hotel;
};

const dummyInstance = ({packageSummary, packageItems, packageHotels}) => {
  const getUniqueId = () => {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  };
  // Dummy package instance
  const rs = {
    id: getUniqueId(),
    packageId: packageSummary.id,
    status: instStatus.INITIATED,
    startDate: null,
    endDate: null,
    isCustomisable: !!packageSummary.isCustomisable,
    isCustomised: false,
    totalDays: packageSummary.totalDays,
    totalPeople: 0,
    totalRooms: 0,
    maxParticipant: packageSummary.maxParticipant,
    carOption: packageSummary.carOption,
    rate: 0,
    items: [],
    hotels: [],
    members: [],
  };
  // Dummy package instance items
  _.each(packageItems, (item) => {
    const it = {
      id: getUniqueId(),
      dayNo: item.dayNo,
      daySeq: item.daySeq,
      description: item.description,
      timePlannable:
        item.timePlannable || (item.attraction ? Global.timePlannable : 0),
      isMustVisit: item.isMustVisit || false,
      attraction: item.attraction ? item.attraction.id : null,
    };
    rs.items.push(it);
  });
  // Dummy package instance hotels
  _.each(packageHotels, (item) => {
    const ho = {
      id: getUniqueId(),
      dayNo: item.dayNo,
      isOverNight: item.isOverNight || !!item.hotel,
      hotel: item.hotel ? item.hotel.id : null,
    };
    rs.hotels.push(ho);
  });
  // Dummy package instance members
  const us = {
    id: getUniqueId(),
    loginId: 'dummy',
    isOwner: true,
    status: instStatus.INITIATED,
    people: 2,
    rooms: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  rs.members.push(us);
  // Return final dummy
  return rs;
};

const getValidCarOptions = (carRates) => {
  const tmp = {};
  const result = [];
  if (carRates && carRates.length > 0) {
    _.each(carRates, (cr) => {
      if (cr.carRates && cr.carRates.length > 0) {
        _.each(cr.carRates, (r) => {
          tmp[r.type] = {count: (tmp[r.type] ? tmp[r.type].count : 0) + 1};
          if (tmp[r.type].count === carRates.length) result.push(r.type);
        });
      }
    });
  }

  return result;
};

export default {};
