import _ from 'lodash';
import React, {createElement} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {withStyles} from '@material-ui/core/styles';
// ====== Icons ======
import SearchIcon from '@material-ui/icons/Search';

// Functions
function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

// Variables
const styles = (theme) => ({
  root: {},
  body: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  appBarFooter: {
    position: 'fixed',
    width: '100%',
    top: 'auto',
    bottom: 0,
  },
  toolbarFooter: {
    display: 'block',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    minHeight: '16px',
  },
});

class PagePlanTrip extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doHandleTabSelect = this.doHandleTabSelect.bind(this);
    // Init state
    this.state = {
      selectedTab: this.props.daySelected || 0,
    };
  }
  // Event Handler
  doHandleTabSelect = (event, newValue) => {
    console.log('>>>>PagePlanTrip.doHandleTabSelect', newValue);
    this.setState({tabSelected: newValue});
  };
  // Display page
  render() {
    console.log('>>>>PagePlanTrip, render()', this.props);
    const {classes} = this.props;
    const {selectedTab} = this.state;
    // Local Variables
    // Sub Components
    const body = (
      <div className={classes.body}>
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={selectedTab}
          onChange={this.doHandleTabSelect}
          aria-label='Vertical tabs example'
          className={classes.tabs}
        >
          <Tab label='Item One' {...a11yProps(0)} />
          <Tab label='Item Two' {...a11yProps(1)} />
          <Tab label='Item Three' {...a11yProps(2)} />
          <Tab label='Item Four' {...a11yProps(3)} />
          <Tab label='Item Five' {...a11yProps(4)} />
          <Tab label='Item Six' {...a11yProps(5)} />
          <Tab label='Item Seven' {...a11yProps(6)} />
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          Item Four
        </TabPanel>
        <TabPanel value={selectedTab} index={4}>
          Item Five
        </TabPanel>
        <TabPanel value={selectedTab} index={5}>
          Item Six
        </TabPanel>
        <TabPanel value={selectedTab} index={6}>
          Item Seven
        </TabPanel>
      </div>
    );

    // Display Widget
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <div>
              <div>Date Selector</div>
              <div>Search</div>
            </div>
          </Toolbar>
        </AppBar>
        {body}
        <AppBar
          position='fixed'
          color='default'
          className={classes.appBarFooter}
        >
          <Toolbar className={classes.toolbarFooter}>
            <Button fullWidth color='primary'>
              Complete
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(PagePlanTrip);
