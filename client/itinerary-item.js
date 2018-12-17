import React, {createElement} from 'react';
//import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import _ from 'lodash';
import TagList from './components/tag-list';

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

    // Generate html for unselected items
    const unselected = getUnselected(allAttraction, itinerary.attractions);
    console.log('>>>>ItineraryItem, unselected list calculated', unselected);

    const styleItitenary = {display: isCustom ? 'block' : 'none'};

    return (
      <div className='itinerary-day-item'>
        <div className='dnd-container'>
          <TagList {...getTagSetting(itinerary.attractions)} />
        </div>
        <div style={styleItitenary} className='dnd-container'>
          <label>Other Attractions: </label>
          <TagList {...getTagSetting(unselected)} />
        </div>
      </div>
    );
  }
}
