import _ from 'lodash';
import React, {createElement} from 'react';
// import Swiper from 'react-id-swiper';
// import {Carousel} from 'react-responsive-carousel';
import Slider from 'react-slick';
import {withStyles} from '@material-ui/core/styles';
import AttractionCard from './attraction-card-new-v2';

const styles = (theme) => ({
  sliderRoot: {
    width: '100%',
  },
  slideRoot: {
    padding: 4,
  },
});

class AttractionSlider extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    window.addEventListener('touchstart', this.touchStart);
    window.addEventListener('touchmove', this.preventTouch, {passive: false});
  }

  componentWillUnmount() {
    window.removeEventListener('touchstart', this.touchStart);
    window.removeEventListener('touchmove', this.preventTouch, {
      passive: false,
    });
  }

  touchStart(e) {
    console.log('>>>>AttractionSlider.touchStart');
    this.firstClientX = e.touches[0].clientX;
    this.firstClientY = e.touches[0].clientY;
  }

  preventTouch(e) {
    console.log('>>>>AttractionSlider.preventTouch');
    const minValue = 5; // threshold

    this.clientX = e.touches[0].clientX - this.firstClientX;
    this.clientY = e.touches[0].clientY - this.firstClientY;

    // Vertical scrolling does not work when you start swiping horizontally.
    if (Math.abs(this.clientX) > minValue) {
      e.preventDefault();
      e.returnValue = false;
      return false;
    }
    return null;
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
      infinite: !!loop,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
    };
    if (attractions && attractions.length > 0) {
      const cards = _.map(attractions, (a, idx) => {
        return (
          <div
            key={idx}
            style={{width: 'unset', display: 'inline-block', padding: 4}}
          >
            <AttractionCard item={a} likeAttraction={doHandleLikeAttraction} />
          </div>
        );
      });
      return (
        <Slider {...settings} className={classes.sliderRoot}>
          {cards}
        </Slider>
      );
    }
    return '';
  }
}

export default withStyles(styles, {withTheme: true})(AttractionSlider);
