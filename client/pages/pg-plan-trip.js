import _ from 'lodash';
import React, {createElement} from 'react';
import 'react-dates/initialize';
import {DateRangePicker} from 'react-dates';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {withStyles} from '@material-ui/core/styles';
import {START_DATE, VERTICAL_ORIENTATION} from 'react-dates/constants';
// ====== Icons && CSS ======
import SearchIcon from '@material-ui/icons/Search';
import 'react-dates/lib/css/_datepicker.css';

// Variables
const styles = (theme) => ({
  root: {
    height: '100%',
  },
  whitespaceTop: {
    height: 50,
  },
  whitespaceBottom: {
    height: 50,
  },
  headerAppBar: {
    position: 'fixed',
    width: '100%',
    top: 0,
    bottom: 'auto',
  },
  headerToolbar: {
    display: 'block',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    minHeight: '16px',
  },
  bodyRoot: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
  },
  bodyTabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  footerAppBar: {
    position: 'fixed',
    width: '100%',
    top: 'auto',
    bottom: 0,
  },
  footerToolbar: {
    display: 'block',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    minHeight: '16px',
  },
});

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
class PagePlanTrip extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.handleTabSelect = this.handleTabSelect.bind(this);
    // Init state
    this.state = {
      tabSelected: this.props.daySelected || 0,
      focusedDateInput: START_DATE,
    };
  }
  // Event Handler
  handleTabSelect = (event, newValue) => {
    console.log('>>>>PagePlanTrip.handleTabSelect', newValue);
    this.setState({tabSelected: newValue});
  };
  // Display page
  render() {
    console.log('>>>>PagePlanTrip, render()', this.props);
    const {classes, plan, actions} = this.props;
    const {handleDateRangeChange} = actions;
    const {startDate, endDate} = plan;
    const {tabSelected, focusedDateInput} = this.state;
    // Local Variables
    // Sub Components
    const body = (
      <div className={classes.bodyRoot}>
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={tabSelected}
          onChange={this.handleTabSelect}
          aria-label='Vertical tabs example'
          className={classes.bodyTabs}
        >
          <Tab label='Item One' {...a11yProps(0)} />
          <Tab label='Item Two' {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={tabSelected} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={tabSelected} index={1}>
          Item Two
        </TabPanel>
      </div>
    );

    // Display Widget
    return (
      <div className={classes.root}>
        <AppBar position='fixed' color='default' className={classes.headerBar}>
          <Toolbar className={classes.headerToolbar}>
            <div>
              <DateRangePicker
                startDate={startDate}
                startDateId='trip_start_date_id'
                endDate={endDate}
                endDateId='trip_end_date_id'
                orientation={VERTICAL_ORIENTATION}
                onDatesChange={handleDateRangeChange}
                focusedInput={focusedDateInput}
                onFocusChange={(focusedInput) =>
                  this.setState({focusedDateInput: focusedInput})
                }
              />
              <div>Search</div>
            </div>
          </Toolbar>
        </AppBar>
        <div className={classes.whitespaceTop} />
        {body}
        <div className={classes.whitespaceBottom} />
        <AppBar
          position='fixed'
          color='default'
          className={classes.footerAppBar}
        >
          <Toolbar className={classes.footerToolbar}>
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
