import _ from 'lodash';
import React, {createElement} from 'react';
import Moment from 'moment';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
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
});
class PackageItineraryNew extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doHandleTabSelect = this.doHandleTabSelect.bind(this);
    // Init data
    const tabSelected = (this.props.daySelected || 1) - 1;
    // Setup state
    this.state = {tabSelected};
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
      const attractionSelected = (
        <div>{`Day ${it.dayNo}: Attraction Selected`}</div>
      );
      const attractionToSelect = isCustomised ? (
        <div>{`Day ${it.dayNo}: Attraction To Select`}</div>
      ) : (
        ''
      );
      const hotelSelected = <div>{`Day ${it.dayNo}: Hotel Selected`}</div>;
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
