import _ from 'lodash';
import React, {createElement} from 'react';
import Swiper from 'react-id-swiper';
// import {Carousel} from 'react-responsive-carousel';
import {withStyles} from '@material-ui/core/styles';
import AttractionCard from './attraction-card-new-v2';

const styles = (theme) => ({
  slideItem: {
    margin: '2px 4px 2px 4px',
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
    let totalDisplay = 0;
    const doHandleLikeAttraction = (item) => {
      if (handleLikeAttraction) {
        handleLikeAttraction(dayNo, timePlannable, item, attractions);
      }
    };
    const likedAttractions = _.filter(attractions, (a) => {
      return a.isLiked;
    });
    const notLikedAttractions = _.filter(attractions, (a) => {
      return !a.isLiked;
    });
    if (showLiked) {
      totalDisplay = likedAttractions.length;
    } else {
      totalDisplay = notLikedAttractions.length;
    }
    const settings = {
      slidesPerView: totalDisplay < 3 ? totalDisplay : 3,
      spaceBetween: 0,
      navigation:
        totalDisplay <= 3
          ? {}
          : {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
      loop: false,
    };
    if (attractions && attractions.length > 0) {
      const cards = _.map(attractions, (a, idx) => {
        const cardStyle =
          (showLiked && a.isLiked) || (!showLiked && !a.isLiked)
            ? {display: 'block', width: '33.33%'}
            : {display: 'none'};
        return (
          <div key={idx} className={classes.slideItem} style={cardStyle}>
            <AttractionCard item={a} likeAttraction={doHandleLikeAttraction} />
          </div>
        );
      });
      return <Swiper {...settings}>{cards}</Swiper>;
    }
    return '';
  }
}

export default withStyles(styles, {withTheme: true})(AttractionSlider);
