import React, {createElement} from 'react';
import HotelCard from './hotel-card';

class HotelSelector extends React.Component {
  constructor(props) {
    super(props);
    const {dayNo, instPackage} = props;
    this.state = {
      idxSelected: instPackage.hotels[dayNo] || -1,
    };
    this.handleSelectHotel = this.handleSelectHotel.bind(this);
  }

  handleSelectHotel = (hotel) => {
    console.log('>>>>HotelCard, handleChange()', {hotel: hotel, state: this.state, props: this.props});
  };

  render() {
    console.log('>>>>HotelCard render()', this.props);
    const {idxSelected} = this.state;
    const {dayNo, instPackage, hotels, apiUri} = this.props;
    const hotelSelector = hotels.map((h) => {
      h.isSelected = instPackage.hotels[dayNo] === idxSelected;
      return (
        <HotelCard
          key={h.id}
          item={h}
          apiUri={apiUri}
          handleClick={this.handleSelectHotel}
        />
      );
    });

    return (
      <div>{hotelSelector}</div>
    );
  }
}

export default HotelSelector;
