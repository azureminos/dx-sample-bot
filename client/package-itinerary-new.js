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
  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <div>{children}</div>
    </Typography>
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
    console.log('>>>>PackageItineraryNew.doHandleTabSelect', newValue);
    this.setState({tabSelected: newValue});
  };
  // Display Widget
  render() {
    // Local variables
    const {classes, daySelected} = this.props;
    const {tabSelected} = this.state;
    console.log('>>>>PackageItineraryNew, Start render with props', {
      daySelected,
    });
    // Sub Widgets

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
            <Tab label='Item One' {...a11yProps(0)} />
            <Tab label='Item Two' {...a11yProps(1)} />
            <Tab label='Item Three' {...a11yProps(2)} />
            <Tab label='Item Four' {...a11yProps(3)} />
            <Tab label='Item Five' {...a11yProps(4)} />
            <Tab label='Item Six' {...a11yProps(5)} />
            <Tab label='Item Seven' {...a11yProps(6)} />
          </Tabs>
        </AppBar>
        <TabPanel value={tabSelected} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={tabSelected} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={tabSelected} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={tabSelected} index={3}>
          Item Four
        </TabPanel>
        <TabPanel value={tabSelected} index={4}>
          Item Five
        </TabPanel>
        <TabPanel value={tabSelected} index={5}>
          Item Six
        </TabPanel>
        <TabPanel value={tabSelected} index={6}>
          Item Seven
        </TabPanel>
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PackageItineraryNew);
