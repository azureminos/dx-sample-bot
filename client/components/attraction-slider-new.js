import _ from 'lodash';
import React, {createElement} from 'react';
// import Swiper from 'react-id-swiper';
// import {Carousel} from 'react-responsive-carousel';
import Swiper from 'react-id-swiper';
import {withStyles} from '@material-ui/core/styles';
import AttractionCard from './attraction-card-new-v2';

const styles = (theme) => ({
  sliderRoot: {
    width: '100%',
  },
  cardRoot: {
    margin: 4,
  },
});

class AttractionSlider extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {classes} = this.props;
    // console.log('>>>>AttractionSlider, render()', this.props);
    const {dayNo, loop, timePlannable, attractions} = this.props;
    const {handleLikeAttraction} = this.props;
    const doHandleLikeAttraction = (item) => {
      if (handleLikeAttraction) {
        handleLikeAttraction(dayNo, timePlannable, item, attractions);
      }
    };
    const settings = {
      slidesPerView: 3,
      spaceBetween: 16,
      loop: !!loop,
    };
    if (attractions && attractions.length > 0) {
      const cards = _.map(attractions, (a, idx) => {
        return (
          <AttractionCard
            key={idx}
            className={classes.cardRoot}
            item={a}
            likeAttraction={doHandleLikeAttraction}
          />
        );
      });
      return (
        <Swiper {...settings} className={classes.sliderRoot}>
          {cards}
        </Swiper>
      );
    }
    return '';
  }
}

export default withStyles(styles, {withTheme: true})(AttractionSlider);
