import React, {createElement} from 'react';
import Swiper from 'react-id-swiper';
import MediaCard from './media-card.js';

const SuperSlider = ({items, btnActionMap, apiUri}) => {
  console.log('>>>>SuperSlider',
    {items: items, btnActionMap: btnActionMap, apiUri: apiUri});

  const params = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  };

  const itemList = items.map((item) => {
    const btnItem = {
      ...item,
      imageUrl: apiUri + '/' + item.imageUrl,
    };

    return (
      <div className='carousel-slide' key={btnItem.id}>
        <MediaCard
          item={btnItem}
          btnActionMap={btnActionMap}
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
