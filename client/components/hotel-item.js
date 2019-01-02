import React, {createElement} from 'react';
//import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import _ from 'lodash';
import ChipList from './chip-list';

const getTagSetting = (attractions, apiUri) => {
  const tags = attractions.map((a) => {
    return {id: a.attractionId, name: a.name, imageUrl: a.imageUrl};
  });

  return {
    tags: tags,
    apiUri: apiUri,
  };
};

export default class HotelItem extends React.Component {
  render() {
    console.log('>>>>HotelItem, Start render with props', this.props);
    // Get data from props
    const {hotels, apiUri} = this.props;

    return (
      <div className='hotel-day-item'>
        <div className='dnd-container'>
          <ChipList {...getTagSetting(hotels, apiUri)} />
        </div>
      </div>
    );
  }
}
