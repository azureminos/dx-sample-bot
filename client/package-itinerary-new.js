import _ from 'lodash';
import React, {createElement} from 'react';
import Moment from 'moment';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import IconCustomise from '@material-ui/icons/Ballot';
import AttractionSlider from './components/attraction-slider-new';
import HotelOverview from './components/hotel-overview';
import CONSTANTS from '../lib/constants';

// Functions
const TabPanel = (props) => {
  const {children, value, index, ...other} = props;
  return value === index ? (
    <Typography
      component='div'
      role='tabpanel'
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <div>{children}</div>
    </Typography>
  ) : (
    ''
  );
};
const a11yProps = (index) => {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
};
// Variables
const {Global, Instance} = CONSTANTS.get();
const InstanceStatus = Instance.status;

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  itemText: {
    fontSize: '1rem',
    fontWeight: 'bolder',
  },
});
class PackageItineraryNew extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doHandleTabSelect = this.doHandleTabSelect.bind(this);
    // Init data
    const tabSelected = (this.props.daySelected || 1) - 1;
    // Setup state
    this.state = {tabSelected: 2};
  }
  // Event Handlers
  doHandleTabSelect = (event, newValue) => {
    // console.log('>>>>PackageItineraryNew.doHandleTabSelect', newValue);
    this.setState({tabSelected: newValue});
  };
  // Display Widget
  render() {
    // Local variables
    const {classes, isCustomised, isOwner, status} = this.props;
    const {actions, rates, transport, itineraries} = this.props;
    const {handleLikeAttraction} = this.props.actions;
    const {tabSelected} = this.state;
    console.log('>>>>PackageItineraryNew.render', {
      isCustomised,
      isOwner,
      status,
      actions,
      rates,
      transport,
      itineraries,
    });
    // Sub Widgets
    const tabLabels = _.map(itineraries, (it) => {
      const label = `Day ${it.dayNo}`;
      return <Tab key={label} label={label} {...a11yProps(it.dayNo - 1)} />;
    });
    const tabPanels = _.map(itineraries, (it) => {
      const likedAttractions = _.filter(it.attractions, (a) => {
        return a.isLiked;
      });
      const notLikedAttractions = _.filter(it.attractions, (a) => {
        return !a.isLiked;
      });
      const selectedHotel = _.find(it.hotels, (h) => {
        return !h.isLiked;
      });
      const btnCustomise =
        isCustomised &&
        notLikedAttractions &&
        notLikedAttractions.length > 0 ? (
          <ListItemSecondaryAction>
            <IconButton aria-label='Comments'>
              <IconCustomise />
            </IconButton>
          </ListItemSecondaryAction>
        ) : (
          ''
        );
      const attractionSelected =
        likedAttractions && likedAttractions.length > 0 ? (
          <List>
            <ListItem
              key={`Day ${it.dayNo}, Selected Attractions Label`}
              role={undefined}
              dense
            >
              <ListItemText
                primary={'Attractions to visit'}
                classes={{primary: classes.itemText}}
              />
              {btnCustomise}
            </ListItem>
            <ListItem
              key={`Day ${it.dayNo}, Selected Attractions Slider`}
              role={undefined}
              dense
            >
              <AttractionSlider
                dayNo={it.dayNo}
                timePlannable={it.timePlannable}
                attractions={likedAttractions}
                handleLikeAttraction={handleLikeAttraction}
              />
            </ListItem>
          </List>
        ) : (
          ''
        );
      const attractionToSelect =
        // isCustomised &&
        notLikedAttractions && notLikedAttractions.length > 0 ? (
          <List>
            <ListItem
              key={`Day ${it.dayNo}, Unselected Attractions Label`}
              role={undefined}
              dense
            >
              <ListItemText
                primary={'Other attractions you may be interested'}
                classes={{primary: classes.itemText}}
              />
            </ListItem>
            <ListItem
              key={`Day ${it.dayNo}, Unselected Attractions Slider`}
              role={undefined}
              dense
            >
              <AttractionSlider
                dayNo={it.dayNo}
                loop
                timePlannable={it.timePlannable}
                attractions={notLikedAttractions}
                handleLikeAttraction={handleLikeAttraction}
              />
            </ListItem>
          </List>
        ) : (
          ''
        );
      const hotelSelected = selectedHotel ? (
        <HotelOverview isCustomised={isCustomised} hotel={selectedHotel} />
      ) : (
        ''
      );
      return (
        <TabPanel key={it.dayNo} value={tabSelected} index={it.dayNo - 1}>
          <Typography component='div'>
            {attractionSelected}
            {attractionToSelect}
            {hotelSelected}
          </Typography>
        </TabPanel>
      );
    });
    return (
      <div className={classes.root}>
        <AppBar position='static' color='default'>
          <Tabs
            value={tabSelected}
            onChange={this.doHandleTabSelect}
            indicatorColor='primary'
            textColor='primary'
            variant='scrollable'
            scrollButtons='auto'
            aria-label='scrollable auto tabs example'
          >
            {tabLabels}
          </Tabs>
        </AppBar>
        {tabPanels}
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PackageItineraryNew);
