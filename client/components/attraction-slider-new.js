import _ from 'lodash';
import React, {createElement} from 'react';
import Swiper from 'react-id-swiper';
// import {Carousel} from 'react-responsive-carousel';
import {withStyles} from '@material-ui/core/styles';
import AttractionCard from './attraction-card-new-v2';

const styles = (theme) => ({
  sliderRoot: {
    width: '100%',
  },
});

class AttractionSlider extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {classes} = this.props;
    // console.log('>>>>AttractionSlider, render()', this.props);
    const {dayNo, timePlannable, attractions, loop, showLiked} = this.props;
    const {handleLikeAttraction} = this.props;
    const doHandleLikeAttraction = (item) => {
      if (handleLikeAttraction) {
        handleLikeAttraction(dayNo, timePlannable, item, attractions);
      }
    };
    const settings = {
      slidesPerView: 3,
      spaceBetween: 0,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      loop: false,
    };
    if (attractions && attractions.length > 0) {
      const cards = _.map(attractions, (a, idx) => {
        const display =
          (showLiked && a.isLiked) || (!showLiked && !a.isLiked)
            ? 'block'
            : 'none';
        return (
          <div key={idx} style={{display: display}}>
            <AttractionCard item={a} likeAttraction={doHandleLikeAttraction} />
          </div>
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
