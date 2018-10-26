import React, { Component } from "react";
import {Button} from 'react-weui';
import Slider from "react-slick";

const CenterSlider = ({items, buttonName, buttonAction, apiUri}) => {
  console.log('>>>>CenterSlider', {items: items, buttonName: buttonName, apiUri: apiUri});

  const settings = {
    className: "center",
    centerMode: true,
    infinite: false,
    centerPadding: "60px",
    slidesToShow: 1,
    speed: 500
  };

  const itemList = items.map((item) => {
    const imageUrl = apiUri + '/' + item.imageUrl;
    return (
        <div key={item.id}>
          <img src={imageUrl} alt={item.name} width="300"></img>
          <p>{item.desc}</p>
          <Button
            name={buttonName}
            onClick={() => buttonAction(item.id)}
          />
        </div>
    );
  });

  console.log('>>>>CenterSlider items', itemList);

  return (
    <div>
      <Slider {...settings}>
        {itemList}
      </Slider>
    </div>
  );
};

export default CenterSlider;
