import React, {createElement} from 'react';
//import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import _ from 'lodash';

// Filter out selected attractions
const getUnselected = (items, selected) => {
  return _.filter(items, (item) => {
    return !_.find(selected, {attractionId: item.attractionId});
  });
};

export default class ItineraryItem extends React.Component {
  render() {
    console.log('>>>>ItineraryItem, Start render with props', this.props);
    // Get data from props
    const {itinerary, attractions, isCustom} = this.props;
    if (isCustom) {
      // Generate html for unselected items
      const unselected = getUnselected(attractions, itinerary.attractions);
      console.log('>>>>ItineraryItem, unselected list calculated', unselected);
      const elUnselected = unselected.map((item) => {
        return (
          <div className='dnd-item' key={item.id}>
          {item.name}
          </div>
        );
      });
      // Generate html for selected items
      const elSelected = itinerary.attractions
        .map((item) => {
          return (
            <div className='demo-slide' key={item.id}>
            {item.name}
            </div>
          );
        });

      return (
        <div>
          <div className='dnd-container'>
            {elUnselected}
          </div>
          <div className='dnd-container'>
            {elSelected}
          </div>
        </div>
      );
    }

    // Generate html for selected items
    const elSelected = itinerary.attractions
      .map((item) => {
        return (
          <div className='dnd-item' key={item.id}>
          {item.name}
          </div>
        );
      });

    return (
      <div>
        <div className='dnd-container'>
          {elSelected}
        </div>
      </div>
    );
  }
}
