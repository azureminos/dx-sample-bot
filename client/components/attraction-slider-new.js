import _ from 'lodash';
import React, {createElement} from 'react';
import Swiper from 'react-id-swiper';
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
    const params = {
      slidesPerView: 3,
      spaceBetween: 8,
    };

    // console.log('>>>>AttractionSlider, render()', this.props);
    const {
      dayNo,
      timePlannable,
      attractions,
      handleLikeAttraction,
    } = this.props;
    const doHandleLikeAttraction = (item) => {
      handleLikeAttraction(dayNo, timePlannable, item, attractions);
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
      if (attractions.length < 3) {
        params.slidesPerView = attractions.length;
      }
      return <Swiper {...params}>{cards}</Swiper>;
    }

    return '';
  }
}

export default withStyles(styles, {withTheme: true})(AttractionSlider);
