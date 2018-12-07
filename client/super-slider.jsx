import React, {createElement} from 'react';
import Swiper from 'react-id-swiper';
import MediaCard from './media-card.js';

const SuperSlider = ({items, buttonName, buttonAction, apiUri}) => {
  console.log('>>>>SuperSlider',
    {items: items, buttonName: buttonName, apiUri: apiUri});

  const params = {
    direction: 'vertical',
    slidesPerView: 'auto',
    spaceBetween: 5,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }
  };

  const itemList = items.map((item) => {
    const imageUrl = apiUri + '/' + item.imageUrl;
    return (
      <div className='demo-slide' key={item.id}>
        <MediaCard key={item.id} />
      </div>
      
      /*<div className='demo-slide' key={item.id}>
        <img src={imageUrl} alt={item.name} width='300'/>
        <p>{item.description}</p>
        <button onClick={() => buttonAction(item)} >{buttonName}</button>
      </div>*/
    );
  });

  return (
    <Swiper {...params}>
      {itemList}
    </Swiper>
  );
};

export default SuperSlider;
