import React, {createElement} from 'react';
import Swiper from 'react-id-swiper';
import HotelCard from './hotel-card';

class HotelSlider extends React.Component {
  constructor(props) {
    super(props);
    const {dayNo, instPackage} = props;
    this.state = {
      idxSelected: instPackage.hotels[dayNo] || -1,
    };
    this.handleSelectHotel = this.handleSelectHotel.bind(this);
  }

  handleSelectHotel = (hotel) => {
    console.log('>>>>HotelSlider, handleChange()', {hotel: hotel, state: this.state, props: this.props});
  };

  render() {
    const params = {
      slidesPerView: 'auto',
      spaceBetween: 8,
    };

    console.log('>>>>HotelSlider, render()', this.props);
    const {idxSelected} = this.state;
    const {dayNo, instPackage, hotels, apiUri} = this.props;
    const hotelSlider = hotels.map((h, idx) => {
      console.log('>>>>HotelSlider, checkSeelcted', {hotel: h, comparator: instPackage.hotels[dayNo]});
      h.isSelected = (instPackage.hotels[dayNo] == idxSelected);
      return (
        <div className='demo-slide' key={idx}>
          <HotelCard
            key={h.id}
            item={h}
            apiUri={apiUri}
            handleSelectHotel={this.handleSelectHotel}
          />
        </div>
      );
    });

    return (
      <Swiper {...params}>
        {hotelSlider}
      </Swiper>
    );
  }
}

export default HotelSlider;
