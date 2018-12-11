import React, {createElement} from 'react';
import Swiper from 'react-id-swiper';

const CardSlider = ({cards}) => {
  console.log('>>>>CardSlider', cards);

  const params = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  };

  const items = cards.map((card, idx) => {
    return (
      <div className='demo-slide' key={idx}>
        {card}
      </div>
    );
  });

  return (
    <Swiper {...params}>
      {items}
    </Swiper>
  );
};

export default CardSlider;