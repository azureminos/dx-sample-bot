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
    const elItineraries = [];
    _.forEach(_.keys(itineraries), (dayNo) => {
      const itinerary = {
        dayNo: dayNo,
        city: itineraries[dayNo][0].city,
        attractions: itineraries[dayNo],
      };
      //console.log('>>>>PackageItinerary, formatted itinerary', itinerary);
      const city = itinerary.city;
      const attractions = cityAttractions[city];
      const setting = {
        trigger: triggerText(dayNo, city),
        open: true,
      };
      //console.log('>>>>PackageItinerary, accordion setting', setting);
      elItineraries.push(
        <Collapsible {...setting} key={dayNo} >
          <ItineraryItem
            itinerary={itinerary}
            attractions={attractions}
            isCustom={instPackage.isCustom}
          />
        </Collapsible>
      );
    });

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
