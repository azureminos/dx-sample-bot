import React, {createElement} from 'react';
import Swiper from 'react-id-swiper';
import HotelCard from './hotel-card';

class HotelSlider extends React.Component {
  constructor(props) {
    super(props);
    const {dayNo, instPackage} = props;
    this.state = {
      idxSelected: instPackage.hotels[dayNo-1] || -1,
    };
    this.handleSelectHotel = this.handleSelectHotel.bind(this);
  }

  handleSelectHotel = (hotel) => {
    console.log('>>>>HotelSlider, handleChange()', {hotel: hotel, state: this.state, props: this.props});
    this.props.instPackage.hotels[dayNo-1] = hotel.id;
    this.setState({idxSelected: hotel.id});
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
      console.log('>>>>HotelSlider, to check Selected', {hotel: h, comparator: instPackage.hotels[dayNo-1]});
      h.isSelected = (h.id == idxSelected);
      console.log('>>>>HotelSlider, checked Selected', h);
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
