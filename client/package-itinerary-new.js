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
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import AttractionSlider from './components/attraction-slider-new';
import HotelOverview from './components/hotel-overview';
import PackageSummary from './components/package-summary';
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
  list: {
    padding: 8,
  },
  listItem: {
    padding: '8px 0px 8px 0px',
  },
  itemText: {
    fontSize: '1rem',
    fontWeight: 'bolder',
  },
});
class PackageItinerary extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doHandleTabSelect = this.doHandleTabSelect.bind(this);
    // Init data
    const tabSelected = this.props.daySelected || 0;
    // Setup state
    this.state = {tabSelected};
  }
  // Event Handlers
  doHandleTabSelect = (event, newValue) => {
    console.log('>>>>PackageItinerary.doHandleTabSelect', newValue);
    this.setState({tabSelected: newValue});
  };
  // Display Widget
  render() {
    // Local variables
    const {classes, windowWidth} = this.props;
    const {actions, transport, itineraries, cities} = this.props;
    const {
      handleSelectCar,
      handleSelectFlight,
      handleLikeAttraction,
      handleAddItinerary,
      handleDeleteItinerary,
    } = actions;
    const {tabSelected} = this.state;
    console.log('>>>>PackageItinerary.render', {
      transport,
      itineraries,
      tabSelected,
    });
    // Sub Widgets
    const tabLabels = [
      <Tab key={'Summary'} label={'Summary'} {...a11yProps(0)} />,
    ];
    _.each(itineraries, (it) => {
      const label = `Day ${it.dayNo}`;
      tabLabels.push(
        <Tab key={label} label={label} {...a11yProps(it.dayNo - 1)} />
      );
    });
    const tabPanels = [
      <TabPanel key={'Summary'} value={tabSelected} index={0}>
        <PackageSummary
          transport={transport}
          itineraries={itineraries}
          cities={cities}
          handleSelectFlight={handleSelectFlight}
          handleSelectCar={handleSelectCar}
          handleClickDay={this.doHandleTabSelect}
        />
      </TabPanel>,
    ];

    _.each(itineraries, (it) => {
      const likedAttractions = _.filter(it.attractions, (a) => {
        return a.isLiked;
      });
      const notLikedAttractions = _.filter(it.attractions, (a) => {
        return !a.isLiked;
      });
      const btnCustomise =
        notLikedAttractions && notLikedAttractions.length > 0 ? (
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => {
                handleAddItinerary(it);
              }}
              aria-label='AddDay'
            >
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                handleDeleteItinerary(it);
              }}
              aria-label='DeleteDay'
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        ) : (
          ''
        );
      const attractionSelected =
        likedAttractions && likedAttractions.length > 0 ? (
          <List className={classes.list}>
            <ListItem
              className={classes.listItem}
              key={`Day ${it.dayNo}, Selected Attractions Label`}
            >
              <ListItemText
                primary={'Attractions to visit'}
                classes={{primary: classes.itemText}}
              />
              {btnCustomise}
            </ListItem>
            <ListItem
              className={classes.listItem}
              key={`Day ${it.dayNo}, Selected Attractions Slider`}
            >
              <AttractionSlider
                dayNo={it.dayNo}
                width={windowWidth - 32}
                showLiked
                timePlannable={it.timePlannable}
                attractions={it.attractions}
                handleLikeAttraction={handleLikeAttraction}
                ref={(el) => (this.container = el)}
              />
            </ListItem>
          </List>
        ) : (
          ''
        );
      const attractionToSelect =
        notLikedAttractions && notLikedAttractions.length > 0 ? (
          <List className={classes.list}>
            <ListItem
              className={classes.listItem}
              key={`Day ${it.dayNo}, Unselected Attractions Label`}
            >
              <ListItemText
                primary={'Other attractions you may be interested'}
                classes={{primary: classes.itemText}}
              />
            </ListItem>
            <ListItem
              className={classes.listItem}
              key={`Day ${it.dayNo}, Unselected Attractions Slider`}
            >
              <AttractionSlider
                dayNo={it.dayNo}
                width={windowWidth - 32}
                loop
                timePlannable={it.timePlannable}
                attractions={it.attractions}
                handleLikeAttraction={handleLikeAttraction}
              />
            </ListItem>
          </List>
        ) : (
          ''
        );
      const hotelSelected =
        it.hotels && it.hotels.length > 0 ? (
          <HotelOverview
            hotels={it.hotels}
            handleSelectHotel={(hotel) => {
              if (actions && actions.handleSelectHotel) {
                actions.handleSelectHotel(it.dayNo, hotel);
              }
            }}
          />
        ) : (
          ''
        );
      tabPanels.push(
        <TabPanel key={it.dayNo} value={tabSelected} index={it.dayNo}>
          {attractionSelected}
          {attractionToSelect}
          {hotelSelected}
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

export default withStyles(styles, {withTheme: true})(PackageItinerary);
