import React from 'react';
import Swiper from 'react-id-swiper';

const SuperSlider = ({items, buttonName, buttonAction, apiUri}) => {
  console.log('>>>>SuperSlider', {items: items, buttonName: buttonName, apiUri: apiUri});

  const params = {
    slidesPerView: 2,
    centeredSlides: true,
    spaceBetween: 5,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }
  };

  const itemList = items.map((item) => {
    const imageUrl = apiUri + '/' + item.imageUrl;
    return (
        <div key={item.id}>
          <img src={imageUrl} alt={item.name} width="300"></img>
          <p>{item.desc}</p>
          <button onClick={() => buttonAction(item.id)} >{buttonName}</button>
        </div>
    );
  });

  console.log('>>>>SuperSlider items', itemList);

  return (
    <div>
      <Swiper {...params}>
        {itemList}
      </Swiper>
    </div>
  );
};

export default SuperSlider;
