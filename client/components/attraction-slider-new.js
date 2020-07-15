import _ from 'lodash';
import React, {createElement} from 'react';
import Swiper from 'react-id-swiper';
// import {Carousel} from 'react-responsive-carousel';
import {withStyles} from '@material-ui/core/styles';
import AttractionCard from './attraction-card-new-v2';
import CONSTANTS from '../../lib/constants';

const styles = (theme) => ({});
class AttractionSlider extends React.Component {
  constructor(props) {
    super(props);
  }
  // Display Widget Content
  renderContent() {
    // console.log('>>>>AttractionSlider, render()', this.props);
    const {classes, width, dayNo, showLiked, recommend} = this.props;
    const {timePlannable, attractions, handleLikeAttraction} = this.props;
    const {Global} = CONSTANTS.get();

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
    const getAlgoRecomment = (input) => {
      return {isShowSameFirst: 1, nSame: 3, nDifferent: 5};
    };

    let totalDisplay = 0;
    let isShowSameFirst = true;
    let nSame = 0;
    let nDifferent = 0;

    if (recommend) {
      const algo = getAlgoRecomment(Global.algoRecommend);
      isShowSameFirst = algo.isShowSameFirst;
      nSame = algo.nSame;
      nDifferent = algo.nDifferent;
    }

    if (showLiked) {
      totalDisplay = likedAttractions.length;
    } else {
      totalDisplay = notLikedAttractions.length;
    }
    const settings = {
      slidesPerView: 3,
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
        const nWidth = `${(width / 3).toFixed()}px`;
        const cardStyle =
          (showLiked && a.isLiked) || (!showLiked && !a.isLiked)
            ? {display: 'block', maxWidth: nWidth, minWidth: nWidth}
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
  // Display Widget
  render() {
    return this.renderContent();
  }
}

export default withStyles(styles, {withTheme: true})(AttractionSlider);
