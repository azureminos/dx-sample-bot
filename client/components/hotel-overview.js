import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import CONSTANTS from '../../lib/constants';
import IconCustomise from '@material-ui/icons/Ballot';

// Functions
// Variables
const {Global, Instance} = CONSTANTS.get();
const InstanceStatus = Instance.status;

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  itemText: {
    fontSize: '1rem',
    fontWeight: 'bolder',
  },
});
class HotelOverview extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    // Init data
    // Setup state
    this.state = {};
  }
  // Event Handlers
  // Display Widget
  render() {
    // Local variables
    const {classes, isCustomised, hotel} = this.props;
    console.log('>>>>HotelOverview.render', {isCustomised, hotel});
    const hotelLabel = `Stay at ${hotel.name}`;
    // Sub Widgets
    const btnCustomise = isCustomised ? (
      <ListItemSecondaryAction>
        <IconButton edge='end' aria-label='select'>
          <IconCustomise />
        </IconButton>
      </ListItemSecondaryAction>
    ) : (
      ''
    );
    // Display Widget
    return (
      <List className={classes.root}>
        <ListItem key={'hotel-title'} dense>
          <ListItemText
            primary={hotelLabel}
            classes={{primary: classes.itemText}}
          />
          {btnCustomise}
        </ListItem>
        <ListItem key={'hotel-description'} dense>
          <Typography component='p'>{hotel.description}</Typography>
        </ListItem>
        <Divider />
        <ListItem key={'hotel-images'} dense>
          <GridList cellHeight={160} className={classes.gridList} cols={1}>
            <GridListTile cols={1}>
              <img src={hotel.imageUrl} alt={'hotel-image'} />
            </GridListTile>
          </GridList>
        </ListItem>
      </List>
    );
  }
}

export default withStyles(styles, {withTheme: true})(HotelOverview);
