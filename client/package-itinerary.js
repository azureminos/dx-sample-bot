import React, {createElement} from 'react';
//import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import ControlledAccordion from './components/accordion';
import SuperSlider from './super-slider.jsx';
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
      const attractions = cityAttractions[city];
      const hotels = cityHotels[city];
      const btnActionMap = {'Select Hotel': selectHotel};
      const title = triggerText(dayNo, city);
      //console.log('>>>>PackageItinerary, accordion setting', setting);

      elItineraries[title] = (
        <div>
          <ItineraryItem
            itinerary={itinerary}
            attractions={attractions}
            isCustom={instPackage.isCustom}
          />
          <SuperSlider
            items={hotels}
            btnActionMap={btnActionMap}
            apiUri={apiUri}
          />
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
