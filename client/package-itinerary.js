import React, {createElement} from 'react';
//import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {withStyles} from '@material-ui/core/styles';
import _ from 'lodash';
import ControlledAccordion from './components/accordion';
import HotelCard from './components/hotel-card.js';
import CardSlider from './card-slider.jsx';
import ItineraryItem from './itinerary-item';


const triggerText = (dayNo, city) => `Day ${dayNo}, ${city}`;

export default class PackageItinerary extends React.Component {
  render() {
    console.log('>>>>PackageItinerary, Start render with props', this.props);
    const {instPackage, cityAttractions, cityHotels, apiUri, selectHotel} = this.props;
    const itineraries = _.groupBy(instPackage.items, (item)=>{
      return item.dayNo;
    });
    console.log('>>>>PackageItinerary, Get itineraries', itineraries);
    // Generate itinerary accordion
    const elItineraries = {};
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
      const hotelCards = cityHotels[city].map((h) => {
        return (
          <HotelCard
            key={h.id}
            item={h}
            apiUri={apiUri}
            handleClick={(item) => {console.log('>>>>HotelCard, handleClick()', item);}}
          />
        );
      });

      elItineraries[title] = (
        <div>
          <ItineraryItem
            itinerary={itinerary}
            attractions={cityAttractions[city]}
            isCustom={instPackage.isCustom}
          />
          <CardSlider cards={hotelCards}/>
        </div>
      );
    });

    return (
      <section>
        <ControlledAccordion mapContents={elItineraries} />
      </section>
    );
  }
}
