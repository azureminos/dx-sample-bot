import React, {createElement} from 'react';
//import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Collapsible from 'react-collapsible';
import {Panel} from 'react-weui';
import _ from 'lodash';
import ItineraryItem from './itinerary-item.js';

const triggerText = (dayNo, city) => `Day ${dayNo}, ${city}`;

export default class PackageItinerary extends React.Component {
  render() {
    console.log('>>>>PackageItinerary, Start render with props', this.props);
    const {instPackage, cityAttractions} = this.props;
    const itineraries = _.groupBy(instPackage.items, (item)=>{
      return item.dayNo;
    });
    console.log('>>>>PackageItinerary, Get itineraries', itineraries);
    // Generate itinerary accordion
    const elItineraries = _.mapKeys(itineraries, (lAttractions, dayNo) => {
      console.log('>>>>PackageItinerary, Get Day '+dayNo, lAttractions);
      const itinerary = {
        dayNo: dayNo,
        city: lAttractions[0].city,
        attractions: lAttractions,
      };
      const city = itinerary.city;
      const attractions = cityAttractions[city];
      const setting = {
        trigger: triggerText(dayNo, city),
        open: true,
      };

      return (
        <Collapsible {...setting} key={dayNo} >
          <ItineraryItem
            itinerary={itinerary}
            attractions={attractions}
            isCustom={instPackage.isCustom}
          />
        </Collapsible>
      );
    });
    console.log('>>>>PackageItinerary, after format itineraries', itineraries);
    return (
      <div>
        <Panel>
          <div>Package Cost: $500</div>
        </Panel>
        <Panel>
          {elItineraries}
        </Panel>
      </div>
    );
  }
}
