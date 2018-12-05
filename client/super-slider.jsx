import React, {createElement} from 'react';
import Swiper from 'react-id-swiper';

const SuperSlider = ({items, buttonName, buttonAction, apiUri}) => {
  console.log('>>>>SuperSlider',
    {items: items, buttonName: buttonName, apiUri: apiUri});

  const params = {
    slidesPerView: 'auto',
    spaceBetween: 5,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  const itemList = items.map((item) => {
    const imageUrl = apiUri + '/' + item.imageUrl;
    return (
        <div className='demo-slide' key={item.id}>
          <img src={imageUrl} alt={item.name} width='300'/>
          <p>{item.description}</p>
          <button onClick={() => buttonAction(item)} >{buttonName}</button>
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
