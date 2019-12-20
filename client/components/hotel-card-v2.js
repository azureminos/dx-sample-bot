import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Swiper from 'react-id-swiper';
import Card from '@material-ui/core/Card';
import IconLocation from '@material-ui/icons/LocationOn';
import IconStar from '@material-ui/icons/StarRate';

const styles = (theme) => ({
  card: {
    width: '95%',
    margin: 8,
  },
  flex: {
    display: 'flex',
    width: '100%',
  },
  imgWrapper: {
    height: 0,
    overflow: 'hidden',
    paddingTop: '56.25%',
    position: 'relative',
  },
  imgItem: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
  },
  cardTextRoot: {
    padding: 8,
    display: 'block',
  },
  hotelName: {
    cursor: 'pointer',
  },
  hotelAddress: {
    width: '80%',
  },
  hotelRate: {
    cursor: 'pointer',
    width: '20%',
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
    };
    const images = _.map(item.carouselImageUrls, (url, key) => {
      const alt = `${item.name} Image ${key}`;
      return (
        <div key={alt} style={{width: '100%'}}>
          <div className={classes.imgWrapper}>
            <img src={url} alt={alt} className={classes.imgItem} />
          </div>
        </div>
      );
    });
    return (
      <Card className={classes.card}>
        <Swiper {...params}>{images}</Swiper>
        <div className={classes.cardTextRoot}>
          <a
            className={classes.hotelName}
            onClick={() => {
              console.log('>>>>HotelCard.Name.Clicked', item);
            }}
          >
            <div>{item.name}</div>
          </a>
          <div className={classes.flex}>
            <IconStar
              style={{
                color: 'yellow',
              }}
            />
          </div>
          <div className={classes.flex}>
            <div className={classes.hotelAddress}>
              <div className={classes.flex}>
                <IconLocation
                  style={{
                    fontSize: 18,
                  }}
                />
                <div>{item.address || 'Address to be updated'}</div>
              </div>
            </div>
            <a
              className={classes.hotelRate}
              onClick={() => {
                console.log('>>>>HotelCard.Price.Clicked', item);
              }}
            >
              <div>$ 999</div>
            </a>
          </div>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles, {withTheme: true})(HotelCard);
