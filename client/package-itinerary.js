import React, {createElement} from 'react';
//import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {withStyles} from '@material-ui/core/styles';
import _ from 'lodash';
import ControlledAccordion from './components/accordion';
import HotelSlider from './components/hotel-slider';
import FlightCar from './components/flight-car';
import ItineraryItem from './itinerary-item';

const triggerText = (dayNo, city) => `Day ${dayNo}, ${city}`;

export default class PackageItinerary extends React.Component {
  render() {
    console.log('>>>>PackageItinerary, Start render with props', this.props);
    const {instPackage, cityAttractions, cityHotels, apiUri, selectHotel, isHotelSelectable} = this.props;
    const itineraries = _.groupBy(instPackage.items, (item)=>{
      return item.dayNo;
    });
    console.log('>>>>PackageItinerary, Get itineraries', itineraries);
    // Generate itinerary accordion
    const elItineraries = {};
    // Add Flight and Cars
    elItineraries['Flight and Car'] = (
      <div>
        <FlightCar />
      </div>
    );

    // Add itinerary for each days
    _.forEach(_.keys(itineraries), (dayNo) => {
      const itinerary = {
        dayNo: dayNo,
        city: itineraries[dayNo][0].city,
        attractions: itineraries[dayNo],
      };
      //console.log('>>>>PackageItinerary, formatted itinerary', itinerary);
      const city = itinerary.city;
      const title = triggerText(dayNo, city);
      //console.log('>>>>PackageItinerary, accordion setting', setting);

      // Prepare attraction card list
      const hotelSelector = isHotelSelectable ? (
        <HotelSlider
          dayNo={Number(dayNo)}
          instPackage={instPackage}
          hotels={cityHotels[city]}
          apiUri={apiUri}
        />
      ) : (
        <div/>
      );

      elItineraries[title] = (
        <div>
          <div>Attractions</div>
          <ItineraryItem
            itinerary={itinerary}
            attractions={cityAttractions[city]}
            isCustom={instPackage.isCustom}
            apiUri={apiUri}
          />
          <div>Hotels</div>
          {hotelSelector}
        </div>
      );
    });

    return (
      <ControlledAccordion mapContents={elItineraries} />
    );
  }
}
