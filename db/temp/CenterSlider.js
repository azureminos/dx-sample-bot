import React, { Component } from "react";
import Slider from "react-slick";

export default class CenterSlider extends Component {

  render() {
    console.log('>>>>CenterSlider', this.props);
    const {items, buttonName} = this.props;
    const settings = {
      className: "center",
      centerMode: true,
      infinite: false,
      centerPadding: "60px",
      slidesToShow: 1,
      speed: 500
    };

    const itemList = items.map((item) => {
      return (
          <div key={item.id}>
            <img src={item.imageUrl} alt={item.name} ></img>
            <p>{item.desc}</p>
            <button>{buttonName}</button>
          </div>
      );
    });

    console.log(itemList);

    return (
      <div>
        <Slider {...settings}>
          {itemList}
        </Slider>
      </div>
    );
  }
}