import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import IconButton from '@material-ui/core/IconButton';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';

const styles = {
  card: {
    maxWidth: 200,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
};

class HotelCard extends React.Component {
  render() {
    const {classes, hotel, apiUri, handleClick} = this.props;
    return (
      <Card className={classes.card}>
        <CardHeader
          action={
            <IconButton onClick={() => handleClick(hotel)}>
              <CheckIcon style={{color: (true) ? green[500] : grey[500]}}/>
            </IconButton>
          }
          title={hotel.name}
        />
        <CardActionArea onClick={() => handleClick(hotel)}>
          <CardMedia
            className={classes.media}
            image={apiUri + '/' + hotel.imageUrl}
            title={hotel.name}
          />
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles)(HotelCard);
