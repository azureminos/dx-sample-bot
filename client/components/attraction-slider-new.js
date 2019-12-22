import _ from 'lodash';
import React, {createElement} from 'react';
// import Swiper from 'react-id-swiper';
// import {Carousel} from 'react-responsive-carousel';
import Slider from 'react-slick';
import {withStyles} from '@material-ui/core/styles';
import AttractionCard from './attraction-card-new-v2';

const styles = (theme) => ({
  slideRoot: {
    padding: 4,
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
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
    };
    if (attractions && attractions.length > 0) {
      const cards = _.map(attractions, (a, idx) => {
        return (
          <div
            className='attraction-slide'
            key={idx}
            className={classes.slideRoot}
          >
            <AttractionCard item={a} likeAttraction={doHandleLikeAttraction} />
          </div>
        );
      });
      return <Slider {...settings}>{cards}</Slider>;
    }
    return '';
  }
}

export default withStyles(styles, {withTheme: true})(AttractionSlider);
