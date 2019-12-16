import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Swiper from 'react-id-swiper';
import Card from '@material-ui/core/Card';

const styles = (theme) => ({
  card: {
    width: '95%',
    margin: 8,
  },
  imgContainer: {
    width: '100%',
  },
  imgWrapper: {
    position: 'relative',
    paddingBottom: '56.2%',
  },
  imgItem: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
  cardTextRoot: {
    padding: 8,
    display: 'block',
  },
  cardTitle: {
    fontSize: 18,
    display: 'inline-block',
    textAlign: 'left',
  },
  cardDescrition: {
    fontSize: 14,
    paddingRight: 8,
  },
});

class HotelCard extends React.Component {
  constructor(props) {
    // console.log('>>>>HotelCard, constructor()', props);
    super(props);
  }

  render() {
    // Local Vairables
    const {classes, item, isReadonly, doSelectHotel} = this.props;
    const params = {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    };
    const images = _.map(item.carouselImageUrls, (url, key) => {
      const alt = `${item.name} Image ${key}`;
      return (
        <div className={classes.imgContainer}>
          <div className={classes.imgWrapper}>
            <img src={url} alt={alt} key={alt} className={classes.imgItem} />
          </div>
        </div>
      );
      // return <img src={url} alt={alt} key={alt} />;
    });
    // console.log('>>>>HotelCard render()', item);
    return (
      <Card className={classes.card}>
        <Swiper {...params}>{images}</Swiper>
        <div className={classes.cardTextRoot}>
          <div className={classes.cardTitle}>{item.name}</div>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles, {withTheme: true})(HotelCard);
