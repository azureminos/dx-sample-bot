import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ReactCardFlip from 'react-card-flip';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import SolidCheckIcon from '@material-ui/icons/CheckCircle';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
};

class AttractionCard extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      isFlipped: false,
    };
  }

  handleClick(e) {
    e.preventDefault();
    this.setState((prevState) => ({isFlipped: !prevState.isFlipped}));
  }

  render() {
    const {classes, item, doLikeAttraction} = this.props;
    console.log('>>>>AttractionCard.render', item);
    return (
      <Card className={classes.card}>
        <ReactCardFlip isFlipped={this.state.isFlipped}>
          <CardContent>
            <CardMedia
              className={classes.media}
              image={item.imageUrl}
              title={item.name}
              onClick={this.handleClick}
            />
          </CardContent>
          <CardContent>
            <Typography variant='h5' component='h3' onClick={this.handleClick}>
              {item.description}
            </Typography>
          </CardContent>
        </ReactCardFlip>
        <CardActions onClick={() => doLikeAttraction(item)}>
          <SolidCheckIcon
            style={{
              display: item.isLiked ? 'block' : 'none',
              color: blue[500],
            }}
          />
          <CheckIcon
            style={{
              display: item.isLiked ? 'none' : 'block',
              color: grey[500],
            }}
          />
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(AttractionCard);