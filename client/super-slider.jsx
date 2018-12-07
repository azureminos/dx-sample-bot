import React, {createElement} from 'react';
import Swiper from 'react-id-swiper';
import MediaCard from './media-card.js';

const SuperSlider = ({items, btnActions, apiUri}) => {
  console.log('>>>>SuperSlider',
    {items: items, btnActions: btnActions, apiUri: apiUri});

  const params = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  };

  const itemList = items.map((item) => {
    const btnItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: apiUri + '/' + item.imageUrl,
    };

    return (
      <div className='demo-slide' key={btnItem.id}>
        <MediaCard
          item={btnItem}
          actions={btnActions}
        />
      </div>
    );
  });

  return (
    <Swiper {...params}>
      {itemList}
    </Swiper>
  );
};

export default SuperSlider;
