// Components
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActionArea';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Divider from '@material-ui/core/Divider';
// Styles
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import SolidCheckIcon from '@material-ui/icons/CheckCircle';
import IconLock from '@material-ui/icons/Lock';
import IconUnlock from '@material-ui/icons/LockOpen';

const styles = (theme) => ({
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
    position: 'absolute',
    width: '100%',
    height: 60,
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
  button: {
    width: '100%',
    height: '100%',
    padding: 0,
  },
  label: {
    // Aligns the content of the button vertically.
    flexDirection: 'column',
  },
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

class AttractionCard extends React.Component {
  constructor() {
    super();
    this.doHandleClose = this.doHandleClose.bind(this);
    this.doLikeAttraction = this.doLikeAttraction.bind(this);
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
  doLikeAttraction(e, item) {
    e.preventDefault();
    this.setState({open: false});
    if (this.props.likeAttraction) {
      this.props.likeAttraction(item);
    }
  }

  render() {
    const {classes, item} = this.props;
    const {open} = this.state;
    console.log('>>>>AttractionCard.render', item);
    // Sub Widget
    const btnLike = !item.isLiked ? (
      <Button
        classes={{root: classes.button, label: classes.label}}
        variant='contained'
        disableRipple
        onClick={(e) => this.doLikeAttraction(e, item)}
      >
        <IconLock />
        Add to itinerary
      </Button>
    ) : (
      ''
    );
    const btnUnlike = item.isLiked ? (
      <Button
        classes={{root: classes.button, label: classes.label}}
        variant='contained'
        disableRipple
        onClick={(e) => this.doLikeAttraction(e, item)}
      >
        <IconUnlock />
        Remove from itinerary
      </Button>
    ) : (
      ''
    );
    const btnClose = (
      <Button
        classes={{root: classes.button, label: classes.label}}
        variant='contained'
        disableRipple
        onClick={this.doHandleClose}
      >
        <CloseIcon />
        Close
      </Button>
    );
    const modal = (
      <Dialog
        fullScreen
        open={open}
        onClose={this.doHandleClose}
        TransitionComponent={Transition}
      >
        <List className={classes.root}>
          <ListItem key={'attraction-images'} dense>
            <GridList cellHeight={160} className={classes.gridList} cols={1}>
              <GridListTile cols={1}>
                <img src={item.imageUrl} alt={'attraction-image'} />
              </GridListTile>
            </GridList>
          </ListItem>
          <Divider />
          <ListItem key={'attraction-description'} dense>
            <Typography component='p'>{item.description}</Typography>
          </ListItem>
        </List>
        <AppBar position='fixed' color='default' className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            {btnLike}
            {btnUnlike}
            {btnClose}
          </Toolbar>
        </AppBar>
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
        <CardActions onClick={(e) => this.doLikeAttraction(e, item)}>
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

export default withStyles(styles, {withTheme: true})(AttractionCard);
