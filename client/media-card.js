import React, {createElement} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {Button, Card, CardActionArea, CardActions,
  CardContent, CardMedia, Typography, withStyles} from '@material-ui/core';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
};

class MediaCard extends React.Component {
  render() {
    const {classes, item, btnActionMap} = this.props;
    const buttons = [];
    _.forEach(btnActionMap, (btnAction, btnName) => {
      buttons.push(
        (<Button key={btnName} size='small' color='primary' onClick={() => btnAction(item)} >
          {btnName}
        </Button>)
      );
    });

    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={item.imageUrl}
            title={item.name}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='h2'>
              {item.name}
            </Typography>
            <Typography component='p'>
              {item.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>{buttons}</CardActions>
      </Card>
    );
  }
}

MediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaCard);
