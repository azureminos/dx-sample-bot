import React, {createElement} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

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
        (<Button key={btnName} size='small' color='primary' onClick={() => btnAction(item.id)} >
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
            <Typography gutterBottom variant='h5'>
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
