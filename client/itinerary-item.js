import React, {createElement} from 'react';
//import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import _ from 'lodash';
import TagList from './tag-list.js';

// Filter out selected attractions
const getUnselected = (items, selected) => {
  return _.filter(items, (item) => {
    return !_.find(selected, {attractionId: item.attractionId});
  });
};

const getTagSetting = (attractions) => {
  const tags = attractions.map((a) => {
    return {id: a.attractionId, text: a.name};
  });

  return {
    tags: tags,
    title: null,
    isReadonly: true,
  };
};

export default class ItineraryItem extends React.Component {
  render() {
    console.log('>>>>ItineraryItem, Start render with props', this.props);
    // Get data from props
    const {itinerary, attractions, isCustom} = this.props;
    const allAttraction = attractions.map((a) => {
      a.attractionId = a.id;
      return a;
    });

    if (true) {
      // Generate html for unselected items
      const unselected = getUnselected(allAttraction, itinerary.attractions);
      console.log('>>>>ItineraryItem, unselected list calculated', unselected);

      return (
        <div>
          <div className='dnd-container'>
            <TagList {...getTagSetting(itinerary.attractions)} />
          </div>
          <div className='dnd-container'>
            <label>Other Attractions: </label>
            <TagList {...getTagSetting(unselected)} />
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className='dnd-container'>
          <TagList {...getTagSetting(itinerary.attractions)} />
        </div>
      </div>
    );
  }
}
