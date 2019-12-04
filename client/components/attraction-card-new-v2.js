import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActionArea';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import SolidCheckIcon from '@material-ui/icons/CheckCircle';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    height: '130px',
    overflow: 'hidden',
  },
  cardText: {
    fontSize: '0.8rem',
    padding: 8,
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: 16,
    flex: 1,
  },
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

class AttractionCard extends React.Component {
  constructor() {
    super();
    this.doHandleClose = this.doHandleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      open: false,
    };
  }
  // Event Handlers
  handleClick(e) {
    e.preventDefault();
    this.setState({open: true});
  }
  doHandleClose(e) {
    e.preventDefault();
    this.setState({open: false});
  }

  render() {
    const {classes, item, doLikeAttraction} = this.props;
    console.log('>>>>AttractionCard.render', item);
    // Sub Widget
    const modal = (
      <Dialog
        fullScreen
        open={open}
        onClose={this.doHandleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={this.doHandleClose}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              {item.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <List component='nav' aria-label='share' />
      </Dialog>
    );
    // Display Widget
    return (
      <Card className={classes.card}>
        <div className={classes.cardContent}>
          <CardMedia
            className={classes.media}
            image={item.imageUrl}
            title={item.name}
            onClick={this.handleClick}
          />
          <Typography
            component='p'
            className={classes.cardText}
            onClick={this.handleClick}
          >
            {item.name}
          </Typography>
          {modal}
        </div>
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
