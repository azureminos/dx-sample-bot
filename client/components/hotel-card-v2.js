import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';

import {Typography} from '@material-ui/core';

const styles = (theme) => ({
  card: {
    width: '100%',
    margin: 8,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  cardTextRoot: {
    padding: 8,
    display: 'block',
  },
  cardTitle: {
    fontSize: 18,
    display: 'inline-block',
    width: '20%',
    textAlign: 'left',
  },
  cardPrice: {
    fontSize: 18,
    display: 'inline-block',
    width: '20%',
    textAlign: 'right',
    paddingRight: 16,
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
    const {classes, item, doSelectHotel} = this.props;
    // console.log('>>>>HotelCard render()', item);
    return (
      <Card key={item.name} className={classes.card}>
        <CardActionArea onClick={(e) => doSelectHotel(e, item)}>
          <CardMedia
            className={classes.media}
            image={item.imageUrl}
            title={item.name}
          />
          <div className={classes.cardTextRoot}>
            <div className={classes.cardTitle}>{item.name}</div>
            <div className={classes.cardPrice}>{'???'}</div>
          </div>
          <Typography component='p'>{item.description}</Typography>
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles, {withTheme: true})(HotelCard);
